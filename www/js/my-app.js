// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;


var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'My App',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
      swipe: 'left',
    },
    // Add default routes
    routes: [
      { path: '/index/',        url: 'index.html',  },
      { path: '/iniciars/',      url: 'iniciars.html',  },
      { path: '/regist/',       url: 'regist.html',  },
      { path: '/vistagral/',        url: 'vistagral.html',  },
      { path: '/addp/',        url: 'addp.html',  },
      { path: '/viewp/:id/',         url: 'viewp.html', },
      { path: '/editp/:id/',         url: 'editp.html', }, 
      { path: '/addfd/:id/',        url: 'addfd.html',  },
      { path: '/viewfd/:id/',        url: 'viewfd.html',  },
      { path: '/descargarfile/:id/',        url: 'descargarfile.html',  },
      { path: '/borrarp/:id/',        url: 'borrarp.html',  },
    ],
    // ... other parameters
    dialog: {
      // set default title for all dialog shortcuts
      title: 'DocuSalud',
     }
  });

var mainView = app.views.create('.view-main');

var db = firebase.firestore();
var colUsuario = db.collection('usuarios');
var colPacientes = db.collection('pacientes');
var colDocumentos = db.collection('documentos');
var storage = firebase.storage();
var datosp;
var namep;
var dni;
var obrasocial;
var numafiliado;
var notas;
var datospacientes;
var namepgral;
var dnipgral;
var osgral;
var afilpgral;
var notasgral;
var docofact;
var urlfile;
var namef;



// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized
    console.log(e);
})
//PAGE INIT INDEX (BOTONES INICAR SESION/REGISTRARSE)
// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="index"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log('paginaprincipal');
})

//PAGE INIT - INICIAR SESIÓN
$$(document).on('page:init', '.page[data-name="iniciars"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    console.log('paginiciarsesion');
    $$('#ingresar').on("click", fnLogin);
    
})

//PAGE INIT REGISTRARSE
$$(document).on('page:init', '.page[data-name="regist"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log("PagRegistro");
  $$('#finregist').on("click", fnRegistro);
 
})

//PAGE INIT VISTA GENERAL DE LOS PACIENTES
$$(document).on('page:init', '.page[data-name="vistagral"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log('VistaGralUsuario');
//De la colección Pacientes tomo aquellos que pertenecen al mail que inicio sesión
  colPacientes.where("Profesional", "==", email).get()    
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {               
        //cargo en variables los datos que necesito de la colección
        namep = doc.data().Nombre;
        obrasocial =  doc.data().OS;
        id = doc.id;
        
        console.log(id + "-" + namep + "-" + obrasocial);
        //formo las variables con los html correspondientes
        namepgral = "<p id='"+id+"'>"+namep+"</p>"
        osgral = "<p id='"+id+"'>"+obrasocial+"</p>"
        linkfd = "<p class='color-gray'><a href=/addfd/"+id+"/ id='linkfd' class=button button-fill button-small centrado>+ documento/factura</a></p>"
        hr = "<hr>"
        //con un append cargo mi div-clase con lo que debe se en pantalla
       // $$('.vistapacientes').append(namepgral + osgral + linkfd + hr);

        //los botones son cargados también con un append y se utiliza el id para formar rutas relativas
        btnver = "<p><a href=/viewp/"+id+"/ class='button button-fill button-small centrado color-gray'>Ver</a></p>"
        btneditar = "<p><a href=/editp/"+id+"/ class='button button-fill button-small centrado color-gray'>Editar</a></p>"
        btnborrar = "<a href=/borrarp/"+id+"/ class='centrado color-red borrarp'>Borrar</a>"
        
        
        $$('.vistapacientes').append(namepgral + osgral + linkfd);
        $$('.vistabotones').append(btnver + btneditar + btnborrar);
        
        
      });
    })
    .catch(function(error) {           
        console.log("Error: " , error);
    });
})


  //PAGE INIT AGREGAR PACIENTE
    // Do something here when page with data-name="about" attribute loaded and initialized
$$(document).on('page:init', '.page[data-name="addp"]', function (e) {

    console.log('PagAddPacientes');

  $$("#guardaraddp").on("click", fnGuardarPacientes);
})

//PAGE INIT VER PACIENTE
$$(document).on('page:init', '.page[data-name="viewp"]', function (e, page) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log('PagVistaPacientes con Id' + page.route.params.id);
  //utilizo el parametro id de la route para tomar el id correpondiente al boton 
  id = page.route.params.id;

  datospacientes = colPacientes.doc(id);

  datospacientes.get().then((doc) => {
      if (doc.exists) {
          console.log("Document data:", doc.data());

          namep = doc.data().Nombre;
          documento = doc.id;
          obrasocial =  doc.data().OS;
          numafiliado = doc.data().Afiliado;
          notas = doc.data().Notas;

          namepgral = "<p id='"+id+"'>Nombre y Apellido: "+namep+"</p>"
          dnipgral = "<p id='"+id+"'>DNI: "+id+"</p>"
          osgral = "<p id='"+id+"'>Obra Social: "+obrasocial+"</p>"
          afilpgral = "<p id='"+id+"'>N° afiliado: "+numafiliado+"</p>"
          notasgral = "<textarea id='"+id+"'>Notas: "+notas+"</textarea>"
          btneditardesdeview = "<a href=/editp/"+id+"/ class='button button-fill button-small centrado color-gray'>Editar</a>"
          
          $$('.datosver').append(namepgral + dnipgral + osgral + afilpgral + notasgral);
          $$('#editpdesdeview').append(btneditardesdeview);
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });

  colDocumentos.where("Documento", "==", id).get()    
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {               
      //cargo en variables los datos que necesito de la colección
      subido = doc.data().Archivos;
      obrasocialarch =  doc.data().OS;
      nombrearch = doc.data().Nombre;
      fechaarch = doc.data().Fecha;
      id = doc.id;
      tipoarch = doc.data().Tipo;

     //imagen = "<img src='"+subido+"' id='imagenvistagral'>"
     //<embed src="files/Brochure.pdf" type="application/pdf" width="100%" height="600px" />
      imagen = "<embed src='"+subido+"' id='imagenvistagral'>"
      btnverarch = "<a href=/viewfd/"+id+"/ id='linkver'class=button button-fill button-small centrado>Ver</a>"
      nombrearch1 = "<p id='"+id+"'>"+nombrearch+"</p>"
      fechaarch1 = "<p id='"+id+"'>"+fechaarch+"</p>"
      tipoarch1 = "<p id='"+id+"'>"+tipoarch+"</p>"

      
      //$$('#mostrarimagen').append(imagen);
      $$('#namepfact').append(nombrearch1);
      $$('#fechafact').append(fechaarch1);
      $$('#tipoarchiv').append(tipoarch1);
      $$('#linkarch').append(btnverarch);

      
      })
    });
  });

    
  //PAGE INIT EDITAR PACIENTE
  $$(document).on('page:init', '.page[data-name="editp"]', function (e, page) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    console.log('PagEditarPacientes con Id' + page.route.params.id);
    //utilizo el parametro id de la route para tomar el id correpondiente al boton 
    id = page.route.params.id;

  datospacientes = colPacientes.doc(id);
  
    datospacientes.get().then((doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            console.log("entro a la pagina de editar")
  
            namep = doc.data().Nombre;
            documento = doc.id;
            obrasocial =  doc.data().OS;
            numafiliado = doc.data().Afiliado;
            notas = doc.data().Notas;

          
            tituloname = "<p class='titinput'>Nombre y Apellido</p>"
            namepgral = "<input type=text id='nameeditado' value='"+namep+"' />"
            tituloos= "<p class='titinput'>Obra Social</p>"
            osgral = "<input type=text id='oseditado' value='"+obrasocial+"' />"
            titulodni= "<p class='titinput'>DNI</p>"
            dnipgral = "<p type=text id='dnieditado' value='"+documento+"'>El DNI no puede ser editado</p>"
            titulonumafil= "<p class='titinput'>Numero Afiliado</p>"
            afilpgral = "<input type=text id='afilpeditado' value='"+numafiliado+"' />"
            titulonotas= "<p class='titinput'>Notas</p>"
            notasgral = "<textarea id='notaseditado' id='"+id+"'>"+notas+"</textarea>";
            
            console.log(namep)
            $$('#nyaedit').append(tituloname + namepgral);
            $$('#dniedit').append(titulodni + dnipgral);
            $$('#osedit').append(tituloos + osgral);
            $$('#numafiledit').append(titulonumafil + afilpgral);
            $$('#notasedit').append(titulonotas + notasgral);

            $$('#guardareditp').on("click", fnEditarPaciente)

            
          
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
});
    
 //PAGE INIT PAGINA PARA BORRAR PACIENTE     
$$(document).on('page:init', '.page[data-name="borrarp"]', function (e, page) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log('PagVistaPacientes con Id' + page.route.params.id);
  //utilizo el parametro id de la route para tomar el id correpondiente al boton 
  id = page.route.params.id;

  datospacientes = colPacientes.doc(id);

  datospacientes.get().then((doc) => {
      if (doc.exists) {
          console.log("Document data:", doc.data());

          namep = doc.data().Nombre;
          documento = doc.id;
          obrasocial =  doc.data().OS;
          numafiliado = doc.data().Afiliado;
          notas = doc.data().Notas;

          namepgral = "<p id='"+id+"'>Nombre y Apellido: "+namep+"</p>"
          dnipgral = "<p id='"+id+"'>DNI: "+id+"</p>"
          osgral = "<p id='"+id+"'>Obra Social: "+obrasocial+"</p>"
          afilpgral = "<p id='"+id+"'>N° afiliado: "+numafiliado+"</p>"
          notasgral = "<textarea id='"+id+"'>Notas: "+notas+"</textarea>"

          
          $$('.datosver').append(namepgral + dnipgral + osgral + afilpgral + notasgral);
          
          $$('#btnborrarp').on('click', fnBorrarP);

          function fnBorrarP (){
            id = documento
            console.log("borrar" +id);
            colPacientes.doc(id).delete()
            .then(() => {
              mainView.router.navigate('/vistagral/');
             
            })
            .catch(() => {
              console.log("error");
            });
            
          }
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });

  });


//PAGE INIT AGREGAR ARCHIVO (FACTURA O DOCUMENTO)
    $$(document).on('page:init', '.page[data-name="addfd"]', function (e, page) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log('PagAddFacturasyDocs');

  id = page.route.params.id;

  datospacientes = colPacientes.doc(id);

  datospacientes.get().then((doc) => {
      if (doc.exists) {
          console.log("Document data:", doc.data());

          namep = doc.data().Nombre;
          documento = doc.id;
          obrasocial =  doc.data().OS;

          namepgral = "<p id='"+id+"'>"+namep+"</p>"
          osgral = "<p id='"+id+"'>"+obrasocial+"</p>"
          
          $$('#addfdpaciente').append(namepgral);
          $$('#addfdobrasocial').append(osgral);

          btnguardar = "<a href=/vistagral/ class='button button-fill button-small centrado color-gray'>Guardar</a>"
          btnvolvervistagral = "<a href=/vistagral/ class='button button-fill button-small centrado color-gray'>Volver</a>"
          
          $$('#divbtnguardar').append(btnguardar);
          $$('#divbtnvolver').append(btnvolvervistagral);
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });

  $$('#divbtnguardar').on('click', fnSubirArchivos)
  
})

//PAGE INIT VER ARCHIVO (FACTURA O DOCUMENTO)
$$(document).on('page:init', '.page[data-name="viewfd"]', function (e, page) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log('PagVistaFacturasyDocs');
  id = page.route.params.id;
  console.log(id);

  datosarchivos = colDocumentos.doc(id);

  datosarchivos.get().then((doc) => {
      if (doc.exists) {
          console.log("Document data:", doc.data());
          urlfile = doc.data().Archivos;
          namef = doc.data().Nombre;


          verimagen = "<embed src='"+urlfile+"' class='sizefoto'>"

          linkdescarga = "<a href=/descargarfile/"+id+"/ class='button button-fill button-small centrado'>Descargar</a>"
          
          $$('#vername').append(namef);
          $$('#mostrarfoto').append(verimagen);
          $$('#descfile').append(linkdescarga);
          
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });

})

//PAGE INIT AGREGAR ALERTA
$$(document).on('page:init', '.page[data-name="descargarfile"]', function (e, page) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log('PagDescargarArchivos');
  id = page.route.params.id;
  console.log(id);

  datosarchivos = colDocumentos.doc(id);

  datosarchivos.get().then((doc) => {
      if (doc.exists) {
          console.log("Document data:", doc.data());
          urlfile = doc.data().Archivos;
          namef = doc.data().Nombre;
          
          downloadFile(namef,urlfile)

          function downloadFile(namef,urlfile){
            console.log("descargar")
            var xhr = new XMLHttpRequest();
            xhr.open('GET', urlfile);
            xhr.responseType = "blob";
                xhr.onload = function () {
                    if (this.status == 200) {
                           var blob = xhr.response;
                           saveFile(namef, blob);
                   //blob tiene el contenido de la respuesta del servidor
                        }
                    };
              xhr.send();
          
          function saveFile(namef,blob){
            window.requestFileSystem( LocalFileSystem.PERSISTENT, 0, function (fs) {                                                                                              
               //abrimos el sistema de archivos                                                                                                                              
               console.log("file system open: " + fs.name);     
               window.resolveLocalFileSystemURL( cordova.file.externalRootDirectory, function (dirEntry){                                                                   
                        //vamos a la raiz del sistema '/'                                                                                                                     
                        console.log("root ", dirEntry);                                                                                                                       
                        dirEntry.getDirectory( "Download", { create: true, exclusive: false }, function (dirEntry)           
                        {                                                          
                                    //vamos a la carpeta download                                                                                                                 
                                    console.log("downloads ", dirEntry);                                                                                                          
                                    dirEntry.getFile( namef, { create: true, exclusive: false }, function (fileEntry){                                                            
                                    writeFile(fileEntry, blob);                                                                                                           
                                    //llamamos a la function writeFile y le pasamos el archivo a guardar                                                                  
                                  },                                                                                                                                        
                                 function (err) {                                                                                  
                                    console.log("failed to create file");                                                                                                 
                                    console.log(err);                                                                                                                     
                                  });                                                                                                                                            
                        },function (err) {                                                                                                                                  
                             console.log(err);
                          });                                                                                                                                                    
                   },function (err) {                                                                                                                                          
                           console.log("Error al descargar el archivo");                                                                                                    
                           console.log(err);                                                                                                                                     
                      });                                                                                                                                                            
              },                                                                                                                                                                
              function (err) {                                                                                                                                                  
                  console.log("Error al descargar el archivo");                                                                                                            
                  console.log(err);                                                                                                                                                
              }); 
            }
            function writeFile(fileEntry, dataObj) {
              fileEntry.createWriter(function (fileWriter) {
                 fileWriter.onwriteend = function () {
                      console.log("Successful file write...");
                      app.dialog.alert("Archivo descargado correctamente")
                      app.dialog.close();
                  };
          
                  fileWriter.onerror = function (e) {
                      console.log("Failed file write: " + e.toString());
                      app.dialog.close();
                      console.log("Error al descargar el archivo");
                  };
          
                  fileWriter.write(dataObj);
                  app.dialog.preloader("Descargando");
              });
          } 
          
        }

         
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });

});


//------------------------FUNCIONES------------------------------

//FUNCION PARA REGISTRARSE (PAGE INIT REGIST)
function fnRegistro (){
  var email = $$('#emailregist').val();
  var password = $$('#contraregist').val();
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((user) => {
    mainView.router.navigate('/iniciars/');
   
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
   alert(errorMessage)
  });
}

//FUNCION PARA AGREGAR PACIENTE (PAGE INIT DE ADDP)
function fnGuardarPacientes (){
  console.log("agregarpaciente")
  namep = $$('#nyaenter').val();
  dni = $$('#dnienter').val();
  obrasocial = $$('#osenter').val();
  numafiliado = $$('#numafilenter').val();
  notas = $$('#notasenter').val();

  fnInicializarPacientes();
}

function fnInicializarPacientes(){
  datosp = {Nombre: namep, OS: obrasocial, Afiliado: numafiliado, Notas: notas, Profesional: email};
  colPacientes.doc(dni).set(datosp);

}
//FUNCION PARA EDITAR PACIENTE
function fnEditarPaciente(){
console.log("editar")

var nameeditado = $$('#nameeditado').val();
var oseditado = $$('#oseditado').val();
var doc = documento;
var afilpeditado = $$('#afilpeditado').val();
var notaseditado = $$('#notaseditado').val();

console.log(nameeditado + oseditado + doc + afilpeditado + notaseditado)

colPacientes.doc(doc).update({
  Nombre: nameeditado, OS: oseditado, Afiliado: afilpeditado, Notas: notaseditado,
}).then(function(){
  app.dialog.alert('Paciente editado')
  mainView.router.navigate('/vistagral/');
})
}

//FUNCION INICIAR SESION (PAGE INIT INICIARS)
function fnLogin (){
  email = $$('#emailinit').val();
  password = $$('#contrainit').val();
  firebase.auth().signInWithEmailAndPassword(email, password)
  .then((user) => {
    mainView.router.navigate('/vistagral/');
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(errorMesage)
  });
}

//FUNCION PARA SUBIR ARCHIVOS AL STORAGE (PAGE INIT DE ADDFD)
function fnSubirArchivos(){
  app.dialog.preloader("Cargando Archivo");

  namestorage = namep;
  obsocstorage = obrasocial;
  dni = id;
  tipo = $$("#tipoarchivo").val();
  fecha = $$("#fechaarchivo").val();
  
  console.log(namestorage + obsocstorage + dni);
  
  var archivo = document.getElementById("archivofoto").files[0];
  var storage = firebase.storage();
  var storageRef = storage.ref('/'+dni+'/'+archivo.name+'');

  storageRef.put(archivo).then(function() {
    
    storageRef.getDownloadURL().then(function(url) {
      console.log("url" +url);
      var fileurl = url;
   
      var fechaEnMiliseg = Date.now();
   
     archivosp = {Nombre: archivo.name, OS: obsocstorage, Documento: dni, Tipo: tipo, Fecha: fecha, Archivos: fileurl};
     colDocumentos.doc(dni + "-" + fechaEnMiliseg).set(archivosp)
     
     app.dialog.close()
     app.dialog.alert('Tu archivo se cargó correctamente')
     mainView.router.navigate('/vistagral/'); 
     
    })
    .catch(() => {
      console.log("error")
    });
  }) 
}
