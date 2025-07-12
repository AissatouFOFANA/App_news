const soap = require('strong-soap').soap;
const { User } = require('../../models');
const { generateToken, verifyToken, extractToken } = require('../../config/jwt');

// WSDL pour le service SOAP
const wsdl = `<?xml version="1.0" encoding="UTF-8"?>
<definitions name="NewsChronicleService"
             targetNamespace="http://newschronicle.com/soap"
             xmlns="http://schemas.xmlsoap.org/wsdl/"
             xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
             xmlns:tns="http://newschronicle.com/soap"
             xmlns:xsd="http://www.w3.org/2001/XMLSchema">

  <message name="AuthenticateUserRequest">
    <part name="username" type="xsd:string"/>
    <part name="password" type="xsd:string"/>
  </message>

  <message name="AuthenticateUserResponse">
    <part name="role" type="xsd:string"/>
    <part name="token" type="xsd:string"/>
    <part name="success" type="xsd:boolean"/>
    <part name="message" type="xsd:string"/>
  </message>

  <message name="ListUsersRequest">
    <part name="token" type="xsd:string"/>
  </message>

  <message name="ListUsersResponse">
    <part name="users" type="xsd:string"/>
    <part name="success" type="xsd:boolean"/>
    <part name="message" type="xsd:string"/>
  </message>

  <message name="AddUserRequest">
    <part name="token" type="xsd:string"/>
    <part name="username" type="xsd:string"/>
    <part name="password" type="xsd:string"/>
    <part name="role" type="xsd:string"/>
  </message>

  <message name="AddUserResponse">
    <part name="success" type="xsd:boolean"/>
    <part name="message" type="xsd:string"/>
    <part name="userId" type="xsd:integer"/>
  </message>

  <message name="DeleteUserRequest">
    <part name="token" type="xsd:string"/>
    <part name="userId" type="xsd:integer"/>
  </message>

  <message name="DeleteUserResponse">
    <part name="success" type="xsd:boolean"/>
    <part name="message" type="xsd:string"/>
  </message>

  <portType name="NewsChroniclePortType">
    <operation name="authenticateUser">
      <input message="tns:AuthenticateUserRequest"/>
      <output message="tns:AuthenticateUserResponse"/>
    </operation>
    <operation name="listUsers">
      <input message="tns:ListUsersRequest"/>
      <output message="tns:ListUsersResponse"/>
    </operation>
    <operation name="addUser">
      <input message="tns:AddUserRequest"/>
      <output message="tns:AddUserResponse"/>
    </operation>
    <operation name="deleteUser">
      <input message="tns:DeleteUserRequest"/>
      <output message="tns:DeleteUserResponse"/>
    </operation>
  </portType>

  <binding name="NewsChronicleBinding" type="tns:NewsChroniclePortType">
    <soap:binding style="rpc" transport="http://schemas.xmlsoap.org/soap/http"/>
    <operation name="authenticateUser">
      <soap:operation soapAction="authenticateUser"/>
      <input><soap:body use="literal"/></input>
      <output><soap:body use="literal"/></output>
    </operation>
    <operation name="listUsers">
      <soap:operation soapAction="listUsers"/>
      <input><soap:body use="literal"/></input>
      <output><soap:body use="literal"/></output>
    </operation>
    <operation name="addUser">
      <soap:operation soapAction="addUser"/>
      <input><soap:body use="literal"/></input>
      <output><soap:body use="literal"/></output>
    </operation>
    <operation name="deleteUser">
      <soap:operation soapAction="deleteUser"/>
      <input><soap:body use="literal"/></input>
      <output><soap:body use="literal"/></output>
    </operation>
  </binding>

  <service name="NewsChronicleService">
    <port name="NewsChroniclePort" binding="tns:NewsChronicleBinding">
      <soap:address location="http://localhost:3000/soap"/>
    </port>
  </service>
</definitions>`;

// Service SOAP
const service = {
  NewsChronicleService: {
    NewsChroniclePortType: {
      // Authentifier un utilisateur
      authenticateUser: async function(args) {
        try {
          const { username, password } = args;
          
          if (!username || !password) {
            return {
              success: false,
              message: 'Nom d\'utilisateur et mot de passe requis',
              role: '',
              token: ''
            };
          }
          
          // Recherche de l'utilisateur
          const user = await User.findOne({ where: { username } });
          if (!user) {
            return {
              success: false,
              message: 'Nom d\'utilisateur ou mot de passe incorrect',
              role: '',
              token: ''
            };
          }
          
          // Vérification du mot de passe
          const isValidPassword = await user.comparePassword(password);
          if (!isValidPassword) {
            return {
              success: false,
              message: 'Nom d\'utilisateur ou mot de passe incorrect',
              role: '',
              token: ''
            };
          }
          
          // Génération du token JWT
          const token = generateToken({
            id: user.id,
            username: user.username,
            role: user.role
          });
          
          return {
            success: true,
            message: 'Authentification réussie',
            role: user.role,
            token: token
          };
        } catch (error) {
          console.error('Erreur SOAP authenticateUser:', error);
          return {
            success: false,
            message: 'Erreur interne du serveur',
            role: '',
            token: ''
          };
        }
      },
      
      // Lister tous les utilisateurs (ADMIN uniquement)
      listUsers: async function(args) {
        try {
          const { token } = args;
          
          if (!token) {
            return {
              success: false,
              message: 'Token requis',
              users: ''
            };
          }
          
          // Vérifier le token JWT
          const decoded = verifyToken(token);
          if (decoded.role !== 'ADMIN') {
            return {
              success: false,
              message: 'Accès refusé. Rôle ADMIN requis',
              users: ''
            };
          }
          
          // Récupérer tous les utilisateurs
          const users = await User.findAll({
            attributes: ['id', 'username', 'role', 'createdAt']
          });
          
          return {
            success: true,
            message: `${users.length} utilisateur(s) trouvé(s)`,
            users: JSON.stringify(users)
          };
        } catch (error) {
          console.error('Erreur SOAP listUsers:', error);
          return {
            success: false,
            message: 'Token invalide ou erreur interne',
            users: ''
          };
        }
      },
      
      // Ajouter un utilisateur (ADMIN uniquement)
      addUser: async function(args) {
        try {
          const { token, username, password, role = 'VISITEUR' } = args;
          
          if (!token) {
            return {
              success: false,
              message: 'Token requis',
              userId: 0
            };
          }
          
          // Vérifier le token JWT
          const decoded = verifyToken(token);
          if (decoded.role !== 'ADMIN') {
            return {
              success: false,
              message: 'Accès refusé. Rôle ADMIN requis',
              userId: 0
            };
          }
          
          if (!username || !password) {
            return {
              success: false,
              message: 'Nom d\'utilisateur et mot de passe requis',
              userId: 0
            };
          }
          
          // Vérifier si l'utilisateur existe déjà
          const existingUser = await User.findOne({ where: { username } });
          if (existingUser) {
            return {
              success: false,
              message: 'Ce nom d\'utilisateur existe déjà',
              userId: 0
            };
          }
          
          // Créer l'utilisateur
          const user = await User.create({
            username,
            password,
            role
          });
          
          return {
            success: true,
            message: 'Utilisateur créé avec succès',
            userId: user.id
          };
        } catch (error) {
          console.error('Erreur SOAP addUser:', error);
          return {
            success: false,
            message: 'Erreur interne du serveur',
            userId: 0
          };
        }
      },
      
      // Supprimer un utilisateur (ADMIN uniquement)
      deleteUser: async function(args) {
        try {
          const { token, userId } = args;
          
          if (!token) {
            return {
              success: false,
              message: 'Token requis'
            };
          }
          
          // Vérifier le token JWT
          const decoded = verifyToken(token);
          if (decoded.role !== 'ADMIN') {
            return {
              success: false,
              message: 'Accès refusé. Rôle ADMIN requis'
            };
          }
          
          if (!userId) {
            return {
              success: false,
              message: 'ID utilisateur requis'
            };
          }
          
          // Rechercher et supprimer l'utilisateur
          const user = await User.findByPk(userId);
          if (!user) {
            return {
              success: false,
              message: 'Utilisateur non trouvé'
            };
          }
          
          await user.destroy();
          
          return {
            success: true,
            message: 'Utilisateur supprimé avec succès'
          };
        } catch (error) {
          console.error('Erreur SOAP deleteUser:', error);
          return {
            success: false,
            message: 'Erreur interne du serveur'
          };
        }
      }
    }
  }
};

// Initialiser le serveur SOAP
const initSoapServer = (app) => {
  const server = soap.listen(app, '/soap', service, wsdl);
  
  console.log('✅ Serveur SOAP initialisé sur /soap');
  console.log('📋 Méthodes disponibles:');
  console.log('   - authenticateUser(username, password)');
  console.log('   - listUsers(token) - ADMIN uniquement');
  console.log('   - addUser(token, username, password, role) - ADMIN uniquement');
  console.log('   - deleteUser(token, userId) - ADMIN uniquement');
  
  return server;
};

module.exports = { initSoapServer };