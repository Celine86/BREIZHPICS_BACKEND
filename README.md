## BREIZHPICS 

Concernant le Back-End:  
La stack utilisé pour le backend est la suivante :  
- MySQL  
- Sequelize  
- NodeJS  
  
**Installer le backend :**  
- Cloner le repository  
- Créer un schéma de BDD, pour ce projet MySQL a été utilisé. 
Pour cela vous pouvez soit utiliser MySQL Command Line Client et taper ``` CREATE DATABASE <nomdebddquevoussouhaitez>; ```, par exemple ``` CREATE DATABASE breizhpics; ```, soit utiliser l'interface graphique de MySQL Workbench.  
- Modifier le fichier .env-example et y indiquer vos informations puis le nommer en .env. /!\ Le mot de passe du compte admin doit contenir 12 caractères minimum avec une majuscule, une minuscule, un chiffre et un caractère spécifique.  
- Lancer ensuite les commandes ci-dessous :  
``` npm install ```  
``` npm start ```  
- Le compte admin sera créé automatiquement et visible dans la BDD.  
  
**Versions utilisées pour ce projet :**  
Node : 16.16.0  
Npm : 8.3.0  