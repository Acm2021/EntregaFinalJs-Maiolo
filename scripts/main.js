
//alert("VINCULADO OK");

/*---------------------------------------------------------*/
function agregarProductoAlCarrito(evt,galeria,carrito){
    if(evt.target.classList.contains("AgregarAlCarrito")){
        const producto =evt.target.parentElement
        const id =producto.querySelector("#card-id").textContent
        let productoEncontrado = galeria.buscarProductoPorId(id)
        carrito.agregarUnProducto(productoEncontrado)
        carrito.mostrarPorPantalla()  
    }
}
function eliminarProductoDelCarrito(evt,carrito){
    
    if(evt.target.id==="borrarProducto"){
        idProductoABorrar =evt.target.getAttribute('data-id')
        carrito.eliminarUnProducto(idProductoABorrar)
        carrito.mostrarPorPantalla();
    }
}
function vaciarCarrito(evt,carrito){
    carrito.vaciar()
    carrito.mostrarPorPantalla()
}
function filtrarGaleria(evt,galeria){
    const nombreAFiltrar=document.querySelector("#busquedaNombre")
    const marcaAFiltrar=document.querySelector("#busquedaMarca")
    const tipoAFiltrar=document.querySelector("#busquedaTipo")
    const galeriaFiltrada = new GaleriaProductos(galeria.filtrarProductos(nombreAFiltrar.value,marcaAFiltrar.value,tipoAFiltrar.value));
    galeriaFiltrada.mostrarGaleriaPorPantalla()
}
function borrarFiltroCarrito(evt,galeria){
    const nombreAFiltrar=document.querySelector("#busquedaNombre")
    const marcaAFiltrar=document.querySelector("#busquedaMarca")
    const tipoAFiltrar=document.querySelector("#busquedaTipo")
    nombreAFiltrar.value= null
    marcaAFiltrar.value=null
    tipoAFiltrar.value=null
    galeria.mostrarGaleriaPorPantalla();
}
function actualizarLocalStorage(elementToSave){
    localStorage.setItem('carrito', JSON.stringify(elementToSave))
}



async function dataRequest (path){
    try{
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error('Error al cargar el archivo JSON');
        }
        const jsonData = await response.json();
        return jsonData
        
    }catch(error){
      console.error('Error:', error);
    };
}

function jsonDataParseProducts(jsonData){
    
    if (jsonData && jsonData.productos) {
        const arregloDeProductos = jsonData.productos.map(productoData => {
            return new Producto(
                productoData.nombre,
                productoData.Tipo,
                productoData.marca,
                productoData.precio,
                productoData.id
            );
        });
    return arregloDeProductos
    }
}


async function fetchDataAndParse(dataPath) {
    try {
        const jsonData = await dataRequest(dataPath); // Espera a que dataRequest se complete
        const arregloDeProductos = jsonDataParseProducts(jsonData);
        return arregloDeProductos;
    } catch (error) {
        console.error('Error al cargar y parsear los datos:', error);
    }
}

function carritoParse(carritoDataJson){
    if (carritoDataJson) {
        let carritoSaved= new Carrito
        carritoSaved= JSON.parse(carritoDataJson)
        
        return carritoSaved
    }
}

function cargarCarritoConStorage(){
    const carritoDataJson = localStorage.getItem('carrito');
    if (carritoDataJson) {
        // Si hay datos, debes analizarlos de nuevo desde JSON a un objeto JavaScript
        carritoSaved= new Carrito()
        carritoSaved2= new Carrito()
        carritoSaved=carritoParse(carritoDataJson)
        for (let i = 0; i < carritoSaved.items.length; i++) {
            const item= new Producto()
             item.nombre = carritoSaved.items[i].nombre;
             item.tipo = carritoSaved.items[i].tipo;
             item.marca = carritoSaved.items[i].marca;
             item.precio = carritoSaved.items[i].precio;
             item.id = carritoSaved.items[i].id;
            // Realiza alguna acción con el elemento 'item'
            carritoSaved2.items.push(item)
        }
        
        
        //carritoSaved2.items=carritoSaved.items
        carritoSaved2.precioTotal=carritoSaved.precioTotal
        carritoSaved2.cantidadElemento=carritoSaved.cantidadElemento
        return carritoSaved2
    } else {
        // Si no hay datos en localStorage, puedes tomar una acción predeterminada
        console.log('No se encontraron datos del carrito en localStorage.');
    }
    
  //  carrito.mostrarPorPantalla()
}

//INICIO

async function inicio(){
    
    let DATA_PATH = 'data/data.json';
    const arregloDeProductos = await  fetchDataAndParse(DATA_PATH);
    const galeria = new GaleriaProductos(arregloDeProductos);
    let carrito = new Carrito();
    carrito=cargarCarritoConStorage()
    carrito.mostrarPorPantalla()
    galeria.mostrarGaleriaPorPantalla();

    const contendorProductosPagina= document.querySelector("#contendorProductos")
    contendorProductosPagina.addEventListener('click', (evt) => {agregarProductoAlCarrito(evt, galeria,carrito)})

    const contendorCarrito = document.querySelector("#cuerpoFilasCarrito")
    contendorCarrito.addEventListener('click', (evt) => {eliminarProductoDelCarrito(evt,carrito)})

    const vaciarCarritoElement = document.querySelector("#vaciar-carrito")
    vaciarCarritoElement.addEventListener('click', (evt) => {vaciarCarrito(evt,carrito)})


    const btnFiltrarGaleria = document.querySelector("#btnFiltroGaleria")
    btnFiltrarGaleria.addEventListener('click',(evt)=> {filtrarGaleria(evt,galeria)})
    const btnBorrarFiltradoGaleria= document.querySelector("#btnBorrarFiltroGaleria")
    btnBorrarFiltradoGaleria.addEventListener('click', (evt)=>{borrarFiltroCarrito(evt,galeria)})

}


inicio();

