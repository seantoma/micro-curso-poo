function step(id, ask, tension, options) {
  return { id, ask, tension, options };
}

function choice(id, label, effect, extra) {
  return { id, label, effect, ...extra };
}

const weeks = {
  1: {
    title: "Decidir sin perder el ejemplar",
    brief:
      "Ana va a prestar E-204, que está disponible en el estante. El equipo discute cómo pasa a prestado. El estante y el préstamo tienen que seguir hablando del mismo objeto, y Ana pide una acción: no administra la memoria ni reescribe campos ajenos.",
    constraints: [
      "E-204 ya existe. El cambio de estado no puede fabricar otro ejemplar con el mismo código.",
      "Quien llama envía un mensaje. No escribe la representación del estado.",
    ],
    pass: "El mensaje llega al ejemplar que ya estaba en el estante y la respuesta no lo sustituye. Identidad, mensaje y objeto concreto quedan en el mismo diseño.",
    fail: "El conjunto no sostiene la identidad de E-204. Alguna decisión fabrica otro objeto, trata la clase como si fuera el libro o saca el cambio del ejemplar.",
    steps: [
      step("cambio", "¿Quién produce el paso de disponible a prestado?", "Ana no es dueña del campo estado. El ejemplar sí recuerda su estado.", [
        choice("mensaje", "Ana envía prestar() al ejemplar que ya existe", "El mensaje prestar() llega a E-204 y el método corre dentro de ese objeto.", { solution: true }),
        choice("nuevo", "Se construye otro Ejemplar con código E-204 y ese queda prestado", "Nace un segundo objeto con el mismo código y el estante conserva el primero.", { fault: "Otro ejemplar con el mismo código no es el libro que estaba en el estante." }),
        choice("asigna", "El programa principal escribe estado = prestado en una variable suelta", "El cambio ocurre fuera del objeto, en una asignación del programa.", { fault: "La asignación no es un mensaje: el ejemplar deja de responder por su propio estado." }),
      ]),
      step("dibujo", "¿Qué figura señala el libro concreto del estante?", "La clase describe a todos los ejemplares. El objeto es el que se puede señalar.", [
        choice("objeto", "Un objeto subrayado, e204 : Ejemplar", "El diagrama nombra la instancia. La clase queda como molde, no como el libro.", { solution: true }),
        choice("clase", "La caja Ejemplar, y se dice que esa caja es el libro del estante", "Se usa el molde como si fuera el ejemplar que Ana tiene en la mano.", { fault: "La caja de clase es el molde. E-204 es la instancia, y de esa clase salen muchos ejemplares." }),
        choice("titulo", "La posición de «Cien años de soledad» en un arreglo de títulos", "El diseño señala un texto, no un objeto capaz de recibir prestar().", { fault: "El título es un dato del ejemplar. No identifica la instancia ni puede recibir el mensaje." }),
      ]),
      step("respuesta", "¿Qué vuelve cuando el mensaje termina?", "La línea de vida de E-204 sigue abierta. La respuesta no abre otra.", [
        choice("prestado", "Una flecha punteada devuelve prestado por la misma línea de vida", "La respuesta informa el estado del mismo objeto. No aparece otro ejemplar.", { solution: true }),
        choice("otro", "La respuesta construye un Ejemplar nuevo y lo devuelve", "El mensaje termina entregando un objeto distinto del que estaba en el estante.", { fault: "La respuesta fabrica otro objeto y la identidad se rompe al cerrar el mensaje." }),
        choice("arreglo", "No hay respuesta: se reemplaza la celda del arreglo de títulos", "El cambio queda en la colección del programa, no en el ejemplar.", { fault: "Sin respuesta del objeto, el cambio quedó fuera de E-204 y nadie puede seguir su línea de vida." }),
      ]),
    ],
    rules: [
      {
        when: { cambio: "mensaje", respuesta: "otro" },
        note: "El mensaje iba al ejemplar vivo y la respuesta lo sustituye por otro. El estante se queda con el primero.",
      },
    ],
    traps: [{ picks: { cambio: "mensaje", dibujo: "objeto", respuesta: "otro" }, excerpt: "lo sustituye" }],
  },
  2: {
    title: "Decidir dónde vive la regla",
    brief:
      "Hay dos ejemplares en el estante. El segundo no puede pisar el estado del primero. Libro responde 15 días y Revista 7, pero quien llama no quiere preguntar el tipo: envía un solo mensaje. La pantalla pide «poner el estado a mano» para ir más rápido.",
    constraints: [
      "Cada ejemplar guarda su estado. Una variable del programa alcanza para un solo libro.",
      "El mismo mensaje puede recibir respuestas distintas. Un setter público no es esa técnica.",
    ],
    pass: "El estado queda en el objeto, el plazo sale del mismo mensaje y la regla vive en el método. Las tres técnicas se sostienen juntas.",
    fail: "Alguna decisión deja el dato al alcance de todos, obliga a quien llama a preguntar el tipo, o publica la representación con otro nombre.",
    steps: [
      step("dato", "¿Dónde queda estado cuando existen dos ejemplares?", "Si el dato no tiene dueño, el segundo préstamo reescribe al primero.", [
        choice("privado", "Un campo de cada instancia, oculto, que solo cambia dentro de prestar()", "Cada ejemplar recuerda el suyo. El método es la única puerta.", { solution: true }),
        choice("publico", "Un campo público para que la pantalla lo actualice sin pasar por el método", "La pantalla escribe la representación y la regla del método puede no ejecutarse.", { fault: "Un campo público permite saltarse la regla. El método existe y no custodia nada." }),
        choice("global", "Una variable estado compartida por todo el programa", "Hay un solo estado para todos los ejemplares del estante.", { fault: "Una variable global alcanza para un ejemplar. El segundo pisa el estado del primero." }),
      ]),
      step("mensaje", "¿Cómo se obtiene el plazo de Libro y de Revista?", "Quien llama no debería ramificar por el nombre de la clase.", [
        choice("polimorfismo", "Las dos reciben diasDePrestamo() y cada clase responde con su plazo", "El mensaje es uno. La respuesta depende de la clase real del objeto.", { solution: true }),
        choice("condicional", "Biblioteca pregunta si el objeto es Libro o Revista y ella calcula los días", "La decisión del plazo sale del objeto y entra en quien llama.", { fault: "Quien llama no debe preguntar el tipo. El objeto es quien sabe responder al mismo mensaje." }),
        choice("copia", "Se crean prestarLibro() y prestarRevista(), cada uno con sus campos copiados", "Hay dos nombres y dos copias de la operación.", { fault: "Dos métodos con distinto nombre no son el mismo mensaje. El polimorfismo no llegó a ocurrir." }),
      ]),
      step("tecnica", "¿Qué cierra el dato para que la técnica sea encapsulamiento?", "Ocultar el nombre del campo y dejar un acceso total sigue siendo exposición.", [
        choice("metodo", "prestar() y devolver() concentran la regla; el campo no se publica", "La operación es el contrato. La representación queda dentro de la clase.", { solution: true }),
        choice("setter", "Se declara private y se ofrece setEstado(String) público, llamado encapsulamiento", "Cualquier código puede dejar el ejemplar en un estado que la regla rechazaría.", { fault: "Un setEstado público vuelve a publicar la representación. El private del campo queda anulado." }),
        choice("comentario", "El campo queda público y un comentario advierte «no tocar»", "El límite está escrito para el lector, no para el compilador ni para el convenio del equipo.", { fault: "El comentario no impide la escritura. En Java el límite es private; en Python, el convenio que el equipo respeta." }),
      ]),
    ],
    rules: [
      {
        when: { dato: "privado", tecnica: "setter" },
        note: "El campo nació privado y el setter lo vuelve a abrir. Encapsular y publicar el acceso total no conviven.",
      },
    ],
    traps: [{ picks: { dato: "privado", mensaje: "polimorfismo", tecnica: "setter" }, excerpt: "lo vuelve a abrir" }],
  },
  3: {
    title: "Decidir la relación que el modelador debe guardar",
    brief:
      "En un diagrama de la semana el rombo lleno aparece cuando el ejemplar no vive fuera de la biblioteca. En este reto el ejemplar puede trasladarse a otra sede: si esta biblioteca cierra, el ejemplar sigue existiendo. Libro y Revista son materiales, con un plazo distinto. Prestamo no es un material. La herramienta tiene que guardar la decisión de este caso, no copiar el rombo del otro diagrama.",
    constraints: [
      "Si la parte sobrevive al todo, el vínculo no es un rombo lleno.",
      "La herencia se lee «es un». Prestamo no es un Ejemplar.",
    ],
    pass: "Queda una asociación 1 a muchos, la generalización de Material y la multiplicidad registrada en la herramienta. El modelo ya se puede implementar sin adivinar.",
    fail: "La relación, la familia o el registro se contradicen. El ejemplar muere con la sede, Prestamo entra en la familia equivocada, o el modelo no dice cuántos hay.",
    steps: [
      step("vinculo", "¿Qué vínculo se dibuja entre Biblioteca y Ejemplar?", "El ejemplar puede irse a otra sede. La biblioteca no es su dueña vitalicia.", [
        choice("asociacion", "Asociación con rol custodia y multiplicidad 1 — *", "Se conocen. La biblioteca custodia muchos ejemplares y cada ejemplar tiene una sede actual.", { solution: true }),
        choice("composicion", "Composición, porque «la biblioteca tiene ejemplares»", "El rombo lleno promete que el ejemplar deja de existir con la biblioteca.", { fault: "El rombo lleno dice que el ejemplar muere con la biblioteca. El caso permite trasladarlo a otra sede." }),
        choice("herencia", "Ejemplar hereda de Biblioteca para reutilizar el nombre de la sede", "El ejemplar quedaría definido como una biblioteca.", { fault: "Un ejemplar no es una biblioteca. Esa flecha se lee «es un», y aquí la relación es «custodia»." }),
      ]),
      step("familia", "¿Dónde quedan Libro, Revista y Prestamo?", "Lo común del material sube una sola vez. El trámite no entra en esa familia.", [
        choice("material", "Libro y Revista generalizan Material; Prestamo queda fuera", "codigo y el mensaje del plazo viven en Material. El préstamo no hereda eso.", { solution: true }),
        choice("prestamo", "Prestamo hereda de Ejemplar para llevarse el código del libro", "El trámite queda modelado como un tipo de ejemplar.", { fault: "El préstamo no es un material. No hereda codigo ni la operación de prestar." }),
        choice("copia", "Libro y Revista repiten codigo, titulo y prestar, sin padre", "Lo común existe dos veces y no hay generalización que mantener.", { fault: "Copiar los campos no aplica la generalización: un cambio del material hay que hacerlo en cada hija." }),
      ]),
      step("registro", "¿Qué tiene que quedar guardado en la herramienta?", "Un nombre de clase no dice cuántos objetos participan ni para qué se conocen.", [
        choice("numeros", "El rol custodia y las multiplicidades 1 y *", "Quien implemente sabe que la biblioteca guarda una colección y cada ejemplar una sede.", { solution: true }),
        choice("nombres", "Solo los nombres Biblioteca y Ejemplar, sin números ni rol", "El diagrama identifica las clases y calla el vínculo.", { fault: "Sin multiplicidad el código no sabe si guarda un ejemplar o una lista, ni para qué se conocen." }),
        choice("pantalla", "Una captura del formulario de préstamo pegada en el modelo", "La evidencia es la pantalla, no la relación.", { fault: "La captura no es el modelo. La herramienta tiene que registrar la relación, el rol y la multiplicidad." }),
      ]),
    ],
    rules: [
      {
        when: { vinculo: "composicion", familia: "material" },
        note: "Material bien generalizado no corrige el rombo: el ejemplar seguiría muriendo con la sede.",
      },
    ],
    traps: [{ picks: { vinculo: "composicion", familia: "material", registro: "numeros" }, excerpt: "seguiría muriendo" }],
  },
  4: {
    title: "Decidir el corte de la aplicación",
    brief:
      "Hay que modelar la aplicación del préstamo para que otro equipo la implemente. Existirán un botón y una tabla, pero el modelo no es la pantalla ni el almacenamiento. Si un préstamo se anula, la persona y el ejemplar siguen existiendo. codigo y titulo pertenecen al material, no al trámite.",
    constraints: [
      "Cada clase cambia por una razón. Un nombre con «y» suele esconder dos.",
      "El botón no aparece en el diagrama de clases del dominio.",
    ],
    pass: "Biblioteca, Ejemplar, Prestamo y Usuario quedan separados, el trámite es de dominio y lo común del material tiene un solo lugar.",
    fail: "El corte mezcla responsabilidades, convierte el trámite en pantalla o en hijo del ejemplar, o deja el mismo dato en dos clases.",
    steps: [
      step("corte", "¿Cómo se reparte la aplicación?", "Usuario, el trámite, el ejemplar y la sede no cambian por la misma razón.", [
        choice("cuatro", "Biblioteca, Ejemplar, Prestamo y Usuario, cada una con una razón de cambio", "La sede custodia, el ejemplar se presta, el trámite vence y la persona solicita.", { solution: true }),
        choice("dios", "Una clase Biblioteca con la persona, las fechas, el botón y el ejemplar", "Todo el préstamo cambia dentro de la misma caja.", { fault: "Esa clase cambia por la persona, por el trámite y por la pantalla. Tiene más de una razón." }),
        choice("tabla", "Una clase TablaPrestamo con las columnas de la base de datos", "El diseño copia el almacenamiento y no nombra las responsabilidades.", { fault: "La tabla es almacenamiento. No sustituye a Usuario, Ejemplar ni al trámite del dominio." }),
      ]),
      step("tramite", "¿Qué es Prestamo en el modelo?", "El préstamo conoce a un ejemplar. Si el trámite se anula, el ejemplar sigue en el estante.", [
        choice("dominio", "Una clase de dominio con fecha de salida, fecha límite y estaVencido()", "El trámite se asocia con el ejemplar. No está hecho de él ni es una ventana.", { solution: true }),
        choice("pantalla", "PantallaPrestamo, con el botón prestar y el color del formulario", "El modelo se queda con el control y pierde la fecha límite.", { fault: "El botón no es el trámite. Sin la fecha límite nadie puede decir si el préstamo venció." }),
        choice("hijo", "Prestamo hereda de Ejemplar para reutilizar el código del libro", "El trámite queda declarado como un tipo de ejemplar.", { fault: "El trámite no es un ejemplar. El código se conoce por asociación, y el ejemplar sobrevive si el préstamo se anula." }),
      ]),
      step("comun", "¿Dónde viven codigo y titulo?", "Libro y Revista comparten esos datos. El plazo es lo que cambia.", [
        choice("material", "En Material. Libro y Revista solo redefinen el plazo", "Lo común tiene un lugar. Lo que varía se redefine abajo.", { solution: true }),
        choice("copia", "Se copian en Libro y también en Revista, para que cada clase se lea sola", "codigo y titulo existen dos veces.", { fault: "El mismo campo en dos hijas obliga a cambiarlo dos veces y ya no hay una sola definición." }),
        choice("prestamo", "Se mudan a Prestamo, porque el trámite es lo que ve la persona", "El título deja de pertenecer al material y pasa al trámite.", { fault: "El título es del material. Otro préstamo del mismo ejemplar no debería duplicar el libro." }),
      ]),
    ],
    rules: [
      {
        when: { corte: "cuatro", comun: "copia" },
        note: "Partir las clases y copiar codigo en los hijos deja dos lugares para el mismo dato.",
      },
    ],
    traps: [{ picks: { corte: "cuatro", tramite: "dominio", comun: "copia" }, excerpt: "dos lugares" }],
  },
  5: {
    title: "Decidir cómo se escribe el paradigma",
    brief:
      "La caja de Ejemplar tiene que alcanzar para implementar prestar() sin adivinar tipos ni visibilidad. E-204 pasa de disponible a prestado con un mensaje y sigue siendo el mismo objeto. Lo que se decida para Ejemplar tiene que poder repetirse en Prestamo y en Usuario: no es una notación exclusiva de una clase.",
    constraints: [
      "El signo menos oculta. El signo más publica. Un nombre suelto no dice cuál es cuál.",
      "Un estado no se convierte en clase nueva solo porque cambió el dato.",
    ],
    pass: "La firma se puede codificar, el estado se mueve con un mensaje y el ocultamiento vale para todas las clases del préstamo.",
    fail: "La notación obliga a adivinar, convierte un estado en otra clase o reserva el paradigma para un solo tipo.",
    steps: [
      step("firma", "¿Cómo queda prestar() en la caja de Ejemplar?", "Quien implementa tiene que leer visibilidad, nombre, tipo y retorno.", [
        choice("completa", "− codigo: String en atributos y + prestar(): void en operaciones", "Se sabe qué está oculto, qué se puede pedir y que el método no devuelve otro objeto.", { solution: true }),
        choice("sueltos", "Las palabras codigo y prestar dentro de la caja, sin signos ni tipos", "Hay nombres y no hay contrato. El tipo y la visibilidad quedan para una conversación.", { fault: "Sin tipo ni visibilidad quien implementa adivina si codigo es público y qué devuelve prestar()." }),
        choice("setter", "+ estado: String y + setEstado(estado: String): void", "El estado y su escritura quedan en la parte pública de la caja.", { fault: "Publicar el estado y su setter abre el dato que prestar() debía custodiar." }),
      ]),
      step("movimiento", "¿Cómo se documenta el paso a prestado?", "UML tiene transición para esto. Una clase nueva diría otra cosa.", [
        choice("transicion", "disponible pasa a prestado con el disparador prestar()", "El objeto sigue siendo E-204. Cambia el estado, no la clase.", { solution: true }),
        choice("clase", "Se crea la clase Prestado y E-204 pasa a ser instancia de ella", "El cambio de dato se modela como un cambio de tipo.", { fault: "Prestado es un estado del mismo ejemplar, no otra clase. La identidad se perdería en el diagrama." }),
        choice("nota", "Una nota «importante» junto a la caja, sin flecha de estado", "El cambio queda como énfasis y no como mensaje.", { fault: "Una nota no dice qué mensaje mueve el estado ni cuál es el estado de llegada." }),
      ]),
      step("comun", "¿Qué se repite en Ejemplar, Prestamo y Usuario?", "El paradigma no es una propiedad de la clase más citada del ejemplo.", [
        choice("cada", "Cada una oculta su estado y ofrece operaciones propias", "prestar(), estaVencido() y solicitar() son mensajes de tres responsables distintas.", { solution: true }),
        choice("solo", "Solo Ejemplar usa private. Prestamo deja las fechas públicas por comodidad", "El ocultamiento queda como excepción de una clase.", { fault: "Lo común del paradigma no es una clase especial. Prestamo también responde por sus fechas." }),
        choice("funciones", "Una clase UtilPrestamo con métodos estáticos y los datos sueltos", "Las operaciones vuelven a vivir fuera de los objetos.", { fault: "Métodos estáticos con datos sueltos devuelven el diseño a un programa por procedimientos." }),
      ]),
    ],
    rules: [
      {
        when: { firma: "completa", movimiento: "clase" },
        note: "La firma describe un método de Ejemplar y la otra decisión convierte prestado en otra clase. El método ya no tiene objeto donde correr.",
      },
    ],
    traps: [{ picks: { firma: "completa", movimiento: "clase", comun: "cada" }, excerpt: "ya no tiene objeto" }],
  },
  6: {
    title: "Decidir la meta y el contrato",
    brief:
      "Usuario quiere prestar un ejemplar y devolverlo. Validar usuario ocurre en todo préstamo. Aplicar sanción solo ocurre si hay retraso. ServicioPrestamo tiene que apartar en el catálogo sin recorrer la lista de CatalogoEnMemoria ni la de CatalogoEnArchivo. Habrá un botón en la pantalla y una tabla en la base.",
    constraints: [
      "El óvalo nombra una meta de la persona, no un control ni una tabla.",
      "Include siempre ocurre. Extend ocurre si se cumple una condición.",
    ],
    pass: "La meta queda fuera de la pantalla, la validación es include y el servicio depende del contrato Catalogo, que se realiza y no se hereda.",
    fail: "El caso de uso nombra un mecanismo, la validación queda opcional o el contrato se ata a una lista o a una herencia.",
    steps: [
      step("ovalo", "¿Qué entra al diagrama de casos de uso?", "Usuario está fuera del borde. Lo de adentro es lo que quiere lograr.", [
        choice("meta", "El óvalo Prestar ejemplar, dentro de Biblioteca, conectado a Usuario", "La meta es prestar. El botón y la tabla quedan fuera del diagrama.", { solution: true }),
        choice("boton", "El óvalo Botón prestar, porque es lo que la persona pulsa", "El caso de uso queda nombrado como un control de la interfaz.", { fault: "El óvalo es una meta de la persona, no un control. Pulsar un botón no es el caso de uso." }),
        choice("tabla", "El óvalo Guardar en la tabla prestamo", "El caso describe un mecanismo de persistencia.", { fault: "Guardar en una tabla es un mecanismo. La meta sigue siendo prestar el ejemplar." }),
      ]),
      step("relacion", "¿Cómo se une Validar usuario con Prestar ejemplar?", "La validación no es opcional y no es el padre del préstamo.", [
        choice("include", "Prestar ejemplar incluye Validar usuario, con flecha punteada «include»", "Siempre se valida. La flecha no es una generalización.", { solution: true }),
        choice("extend", "Validar usuario extiende Prestar ejemplar, porque es un paso de más", "La validación queda como un añadido condicional.", { fault: "Extend es lo que ocurre a veces. Validar usuario ocurre siempre, así que el estereotipo es include." }),
        choice("herencia", "Validar usuario hereda de Prestar ejemplar con triángulo de generalización", "Se usa la flecha de herencia entre metas.", { fault: "Include y extend son flechas punteadas con el estereotipo. No son herencia entre casos de uso." }),
      ]),
      step("contrato", "¿De qué depende ServicioPrestamo para apartar?", "Mañana el catálogo puede estar en memoria o en archivo. El servicio no debería enterarse.", [
        choice("realiza", "Depende de la interfaz Catalogo. Las clases concretas la realizan", "El servicio llama apartar. La lista o el archivo quedan detrás de la realización.", { solution: true }),
        choice("estado", "Catalogo es una clase concreta que guarda la lista de ejemplares", "El contrato y la representación viajan juntos.", { fault: "Si el contrato guarda la lista, el servicio queda atado a una representación y la otra implementación no cabe." }),
        choice("extends", "Biblioteca hereda de Catalogo con extends", "El contrato se usa como padre.", { fault: "Una interfaz se implementa. extends la trata como una clase padre, y en Java el contrato no se hereda así." }),
      ]),
    ],
    rules: [
      {
        when: { ovalo: "meta", relacion: "extend" },
        note: "La meta está bien nombrada y la relación la vuelve opcional. Habría préstamos en los que el usuario no se valida.",
      },
    ],
    traps: [{ picks: { ovalo: "meta", relacion: "extend", contrato: "realiza" }, excerpt: "la vuelve opcional" }],
  },
  7: {
    title: "Decidir el molde y dejarlo en la herramienta",
    brief:
      "El equipo consulta StarUML para registrar el modelo, no para pegar un dibujo. Material guarda titulo y declara prestar() sin cuerpo: Libro y Revista tienen que cerrarlo. No se construye Material. Los paquetes dominio y prestamo separan el material del trámite. La evidencia de la consulta es el modelo guardado en la herramienta.",
    constraints: [
      "Una clase abstracta puede guardar estado. Una interfaz no guarda titulo.",
      "La cursiva prohíbe new Material(). El objeto concreto es Libro o Revista.",
    ],
    pass: "Material queda abstracta y con estado, la variable puede ser Material y el objeto es Libro, y StarUML guarda ese modelo con sus paquetes.",
    fail: "El molde se confunde con una interfaz, se instancia, o la evidencia no es el modelo de la herramienta.",
    steps: [
      step("molde", "¿Cómo se declara Material?", "Tiene titulo y un método que las hijas deben completar.", [
        choice("abstracta", "Clase abstracta, en cursiva, con titulo y prestar() sin cuerpo", "Guarda estado y obliga a Libro y a Revista a cerrar el método.", { solution: true }),
        choice("interfaz", "«interfaz» Material, con el campo titulo y prestar()", "El contrato intentaría guardar el título.", { fault: "La interfaz no guarda titulo. El estado del material pide una clase abstracta, no un contrato vacío." }),
        choice("concreta", "Material concreta cuyo prestar() está vacío y devuelve éxito", "Se puede construir un material que no es libro ni revista.", { fault: "Un cuerpo vacío permite new Material() y un préstamo que no corresponde a ningún material real." }),
      ]),
      step("construccion", "¿Qué objeto se construye?", "La variable y el objeto no tienen por qué ser la misma clase.", [
        choice("libro", "Material libro = new Libro(), y Libro cierra prestar()", "La variable usa el molde. El objeto es concreto.", { solution: true }),
        choice("material", "Material libro = new Material()", "Se intenta construir el molde.", { fault: "El molde no se instancia. Si falta el cuerpo de prestar(), la clase sigue siendo abstracta." }),
        choice("catalogo", "Libro hereda de Catalogo para reutilizar apartar()", "El material queda declarado como un catálogo.", { fault: "Libro no es un catálogo. apartar pertenece al contrato del catálogo y el libro lo usa, no lo hereda." }),
      ]),
      step("evidencia", "¿Qué se entrega como resultado de la consulta a la herramienta CASE?", "StarUML guarda clases, estereotipos y paquetes. Una imagen no se puede seguir editando como modelo.", [
        choice("modelo", "El diagrama de clases en el modelo de StarUML, con «abstracta» y los paquetes dominio y prestamo", "La herramienta conserva Material, Libro, Revista y la frontera entre paquetes.", { solution: true }),
        choice("foto", "Una captura de pantalla pegada en el foro", "Se entrega una imagen del momento, sin el modelo.", { fault: "La captura no se puede revisar como modelo: no tiene relaciones ni estereotipos editables." }),
        choice("nota", "El código Java pegado en una nota, sin crear las clases en el modelo", "El texto del lenguaje sustituye al diagrama de la herramienta.", { fault: "La nota no sustituye las clases. StarUML tiene que guardar Material, Libro y Revista como elementos del modelo." }),
      ]),
    ],
    rules: [
      {
        when: { molde: "abstracta", construccion: "material" },
        note: "Declarar el molde y luego construirlo se contradicen: la cursiva prohíbe el new.",
      },
    ],
    traps: [{ picks: { molde: "abstracta", construccion: "material", evidencia: "modelo" }, excerpt: "prohíbe el new" }],
  },
  8: {
    title: "Decidir el tratamiento cuando E-204 ya está prestado",
    brief:
      "Ana insiste en prestar E-204 y el ejemplar ya está prestado. También pueden llegar un usuario nulo o una fecha límite imposible: son tres fallos distintos. El ejemplar detecta y avisa. No cobra la multa ni finge que el préstamo ocurrió. Quien llama, más arriba, decide si reintenta o se lo dice a la persona.",
    constraints: [
      "Una operación que falla no cambia el objeto y además avisa.",
      "Depurar es seguir el proceso hasta el motivo, con el dato que sí falla.",
    ],
    pass: "La guarda va antes de la asignación, el aviso sale hacia quien llama y la depuración usa el ejemplar que ya estaba prestado.",
    fail: "El estado cambia aunque el aviso diga que falló, el ejemplar decide la sanción, el fallo se esconde o la prueba se altera para que pase.",
    steps: [
      step("orden", "¿En qué orden quedan la guarda y la asignación?", "E-204 ya está prestado. Esa pregunta se responde antes de escribir el campo.", [
        choice("guarda", "Si el estado no es disponible, se lanza el error y no se asigna prestado", "El objeto sigue prestado y quien llama recibe el motivo.", { solution: true }),
        choice("despues", "Se asigna prestado y después se lanza el error", "El ejemplar ya cambió cuando el aviso dice que la operación no debió ocurrir.", { fault: "El objeto ya cambió y el aviso dice que la operación falló. Estado y mensaje quedan en contradicción." }),
        choice("tragar", "Se atrapa el error dentro de prestar() y se deja el ejemplar disponible", "El método corrige el dato para que parezca que no pasó nada.", { fault: "El catch reescribe el estado y esconde que el préstamo no debió ocurrir." }),
      ]),
      step("politica", "¿Quién decide qué hacer con el fallo?", "Detectar el ejemplar prestado no es cobrar ni callar.", [
        choice("avisar", "El error sale de prestar() y quien llama decide si reintenta o avisa a la persona", "Ejemplar informa. La política de la biblioteca queda arriba.", { solution: true }),
        choice("multa", "Ejemplar cobra la multa dentro de prestar() antes de volver", "El ejemplar conoce tarifas y sanciones.", { fault: "Detectar no es decidir la sanción. El ejemplar no conoce la política de cobro de la biblioteca." }),
        choice("vacio", "Un catch vacío, o except: pass, para que el programa no se detenga", "El fallo se absorbe y prestar() termina como si hubiera seguido.", { fault: "El fallo desaparece. Un segundo intento parece válido porque nadie vio el motivo." }),
      ]),
      step("depurar", "¿Cómo se comprueba este fallo?", "El caso interesante es el ejemplar que ya no se puede prestar.", [
        choice("dato", "Un punto de interrupción con E-204 ya prestado, mirando si el estado sobrevivió", "Se observa la línea de la guarda y el estado que no debió cambiar.", { solution: true }),
        choice("print", "Un print al final del método que dice «listo»", "El rastro aparece cuando el método ya terminó.", { fault: "El print del final no muestra en qué línea el flujo se desvió ni si el estado cambió antes del aviso." }),
        choice("amanar", "Cambiar el ejemplar de prueba a disponible para que el caso pase", "Se modifica el dato de entrada hasta obtener éxito.", { fault: "Se cambia el dato para obtener éxito. El fallo deja de existir y no hay nada que depurar." }),
      ]),
    ],
    rules: [
      {
        when: { orden: "guarda", politica: "vacio" },
        note: "La guarda detecta el ejemplar prestado y el catch vacío tira ese aviso. El tratamiento queda escrito y no se puede observar.",
      },
    ],
    traps: [{ picks: { orden: "guarda", politica: "vacio", depurar: "dato" }, excerpt: "no se puede observar" }],
  },
};

export function decisionFor(week) {
  const challenge = weeks[week];
  return [
    { type: "section", id: "decision", title: "Decisión técnica" },
    { type: "decision", id: "decision-tecnica", ...challenge },
  ];
}
