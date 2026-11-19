import { complementFor } from "./complementos.js";
import { extrasFor } from "./extras.js";

export const COURSE = {
  title: "Desarrollo de Software Orientado a Objetos",
  subtitle: "Ocho semanas de contenido",
};

const prestamo = "préstamo de un ejemplar en una biblioteca";

const RAW = [
  {
    week: 1,
    title: "Conceptos clave de la POO",
    syllabus: ["Comprende conceptos clave de la POO."],
    summary:
      "Un programa orientado a objetos se piensa como objetos que colaboran. Esta semana fija el vocabulario: objeto, clase, mensaje, estado, comportamiento e identidad.",
    minutes: 50,
    objectives: [
      "Explicar objeto, clase, mensaje, estado y comportamiento.",
      "Distinguir un programa escrito por procedimientos de uno organizado en objetos.",
      "Reconocer identidad, estado y comportamiento en un caso concreto.",
    ],
    blocks: [
      {
        type: "paragraphs",
        paragraphs: [
          "La programación orientada a objetos (POO) es un paradigma: una forma de organizar el problema antes de escribir instrucciones. En lugar de una lista de pasos que manipulan datos sueltos, el programa se reparte entre objetos. Cada objeto guarda su propio estado y ofrece un comportamiento.",
          `El hilo de estas ocho semanas es un ${prestamo}. Hoy no se modela el sistema completo. Hoy se nombra lo que hay: un ejemplar concreto, una persona usuaria y la acción de prestar.`,
        ],
      },
      { type: "section", id: "lectura", title: "Conceptos" },
      {
        type: "cards",
        title: "Seis ideas que viajan juntas",
        items: [
          {
            kicker: "Paradigma",
            title: "Una manera de ver el problema",
            body: "La POO no es un lenguaje. Java, C# o Python pueden usarse con este paradigma o sin él. El paradigma decide qué unidades existen en el diseño.",
          },
          {
            kicker: "Objeto",
            title: "Una entidad concreta",
            body: "El ejemplar con código E-204, título «Cien años de soledad» y estado disponible es un objeto. Existe, se puede señalar y cambia con el tiempo.",
          },
          {
            kicker: "Clase",
            title: "El molde de objetos parecidos",
            body: "La clase Ejemplar describe qué datos y qué operaciones comparten todos los ejemplares. No es el libro que está en el estante: es la definición.",
          },
          {
            kicker: "Mensaje",
            title: "La petición entre objetos",
            body: "Usuario le pide a Ejemplar que se preste. Quien envía el mensaje no necesita saber cómo se actualiza el estante por dentro.",
          },
          {
            kicker: "Estado",
            title: "Los datos en un momento",
            body: "Disponible, prestado o en reparación son estados del mismo ejemplar. El estado vive en el objeto, no en una variable global del programa.",
          },
          {
            kicker: "Comportamiento",
            title: "Lo que el objeto sabe hacer",
            body: "Prestar, devolver y consultar disponibilidad son comportamientos. Cambian el estado o informan de él, siempre a través de una operación.",
          },
        ],
      },
      {
        type: "compare",
        title: "Procedimientos frente a objetos",
        leftTitle: "Programa por procedimientos",
        rightTitle: "Programa orientado a objetos",
        rows: [
          ["Los datos viajan de función en función.", "Cada objeto guarda sus datos."],
          ["Cualquier función puede modificar el arreglo de ejemplares.", "Solo el ejemplar cambia su propio estado, si su clase lo permite."],
          ["El orden del programa es la lista de rutinas.", "El orden aparece cuando los objetos se envían mensajes."],
          ["La identidad es la posición en un arreglo.", "La identidad permanece aunque cambie el estado."],
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "Identidad no es estado",
        body: "E-204 sigue siendo el mismo ejemplar cuando pasa de disponible a prestado. Cambió el estado. No cambió la identidad. Si se confunden, el modelo trata cada cambio como si naciera otro objeto.",
      },
      {
        type: "flip",
        title: "Memoria activa",
        hint: "Toca cada tarjeta para ver el reverso.",
        cards: [
          {
            front: "¿La clase es el objeto?",
            back: "No. La clase describe. El objeto existe en un momento del programa. De una clase Ejemplar salen muchos ejemplares.",
          },
          {
            front: "¿Qué es un mensaje?",
            back: "Es la solicitud de un objeto a otro para que ejecute un comportamiento. Quien llama no reescribe los datos ajenos.",
          },
          {
            front: "¿Dónde vive el estado?",
            back: "En el objeto. «Prestado» es un dato de E-204, no una bandera suelta del programa principal.",
          },
          {
            front: "¿POO es lo mismo que usar clases en un lenguaje?",
            back: "No basta declarar class. Hay POO cuando los objetos colaboran y cada uno responde por su estado.",
          },
        ],
      },
      { type: "section", id: "practica", title: "Práctica" },
      {
        type: "sort",
        id: "s1-orden",
        title: "Orden para leer un problema con objetos",
        instructions: "Sube o baja cada paso hasta reconstruir la lectura. Luego comprueba.",
        success: "Ese es el orden: primero el objeto concreto, después la clase, luego su estado y al final el mensaje.",
        items: [
          { id: "mensaje", label: "Decidir qué mensaje le envía un objeto a otro" },
          { id: "clase", label: "Agrupar los objetos parecidos en una clase" },
          { id: "estado", label: "Describir el estado que ese objeto recuerda" },
          { id: "objeto", label: "Señalar un objeto concreto del problema" },
        ],
        correct: ["objeto", "clase", "estado", "mensaje"],
      },
      {
        type: "checklist",
        id: "s1-cierre",
        title: "Cierre de la semana",
        items: [
          { id: "a", label: "Expliqué objeto, clase y mensaje con el ejemplar E-204" },
          { id: "b", label: "Diferencié identidad y estado en voz alta" },
          { id: "c", label: "Ordené la lectura del problema y comprobé el resultado" },
        ],
      },
    ],
  },
  {
    week: 2,
    title: "Elementos y técnicas de la POO",
    syllabus: [
      "Conoce los elementos propios de la POO.",
      "Define las técnicas de programación orientada a objetos (POO).",
    ],
    summary:
      "Los elementos son las piezas que se nombran en un diseño: clase, objeto, atributo, método, constructor y visibilidad. Las técnicas son las decisiones que usan esas piezas: abstracción, encapsulamiento, herencia y polimorfismo.",
    minutes: 55,
    objectives: [
      "Nombrar los elementos de una clase y qué guarda cada uno.",
      "Definir abstracción, encapsulamiento, herencia y polimorfismo.",
      "Reconocer qué técnica está en juego en un fragmento breve.",
    ],
    blocks: [
      {
        type: "paragraphs",
        paragraphs: [
          "Conocer un elemento es saber qué lugar ocupa. Un atributo es un dato del objeto. Un método es un comportamiento. Un constructor deja el objeto en un estado inicial válido. La visibilidad dice quién puede ver cada miembro: público para quien colabora, privado para el interior de la clase.",
          "Definir una técnica es decir, con palabras propias, qué problema resuelve. No alcanza repetir el nombre.",
        ],
      },
      { type: "section", id: "lectura", title: "Elementos" },
      {
        type: "trail",
        title: "Piezas de una clase",
        hint: "Abre cada pieza. El recorrido queda marcado en este navegador.",
        items: [
          {
            id: "clase",
            title: "Clase",
            body: "Ejemplar declara atributos y métodos. Es el texto del diseño. No ocupa un estante.",
          },
          {
            id: "objeto",
            title: "Objeto",
            body: "E-204 es una instancia de Ejemplar. Se crea en tiempo de ejecución y tiene identidad propia.",
          },
          {
            id: "atributo",
            title: "Atributo",
            body: "codigo, titulo y disponible son atributos. Describen el estado. Si disponible cambia, el mismo objeto sigue siendo E-204.",
          },
          {
            id: "metodo",
            title: "Método",
            body: "prestar(usuario) y devolver() son métodos. Son el comportamiento que otros objetos pueden solicitar.",
          },
          {
            id: "constructor",
            title: "Constructor",
            body: "Al nacer, el ejemplar recibe código y título, y queda disponible. El constructor impide un objeto a medias.",
          },
          {
            id: "visibilidad",
            title: "Visibilidad",
            body: "disponible se marca privado: nadie lo asigna desde fuera. prestar es público: es el mensaje que el resto del programa sí puede enviar.",
          },
        ],
      },
      { type: "section", id: "tecnicas", title: "Técnicas" },
      {
        type: "cards",
        title: "Cuatro definiciones para poder repetirlas",
        items: [
          {
            kicker: "Abstracción",
            title: "Quedarse con lo que importa",
            body: "De un libro real se conservan código, título y si está disponible. Se dejan fuera el olor del papel y el nombre de quien lo editó, si el préstamo no los usa.",
          },
          {
            kicker: "Encapsulamiento",
            title: "Ocultar el dato y publicar la operación",
            body: "disponible no se escribe desde fuera. Se cambia solo dentro de prestar y devolver, que pueden rechazar un préstamo imposible.",
          },
          {
            kicker: "Herencia",
            title: "Una clase nueva reutiliza otra",
            body: "Libro y Revista comparten lo de Material (código, título, prestar). Cada una añade lo que la otra no tiene.",
          },
          {
            kicker: "Polimorfismo",
            title: "El mismo mensaje, distintas respuestas",
            body: "diasDePrestamo() existe en Libro y en Revista. Quien llama no pregunta el tipo: envía el mensaje y cada clase responde con su regla, 15 días o 7.",
          },
        ],
      },
      {
        type: "callout",
        tone: "note",
        title: "Definición propia",
        body: "Escribe una frase por técnica, sin mirar las tarjetas. Si en la frase no cabe un ejemplo del ejemplar, la definición todavía está vacía.",
      },
      { type: "section", id: "practica", title: "Práctica" },
      {
        type: "quiz",
        id: "s2-tecnica",
        title: "¿Qué técnica es?",
        prompt:
          "El programa impide escribir ejemplar.disponible = true desde la pantalla. Solo prestar() puede cambiar ese dato, y antes revisa que el ejemplar esté libre.",
        options: [
          {
            id: "abs",
            label: "Abstracción",
            ok: false,
            why: "La abstracción elige qué datos existen. Aquí el dato ya existe y se está protegiendo la forma de cambiarlo.",
          },
          {
            id: "enc",
            label: "Encapsulamiento",
            ok: true,
            why: "El estado queda oculto y solo cambia por un método que conoce la regla.",
          },
          {
            id: "her",
            label: "Herencia",
            ok: false,
            why: "No hay una clase que reutilice a otra. Hay una frontera entre el dato y quien lo usa.",
          },
          {
            id: "pol",
            label: "Polimorfismo",
            ok: false,
            why: "No hay el mismo mensaje con respuestas distintas. Hay una sola operación que custodia el dato.",
          },
        ],
      },
      {
        type: "checklist",
        id: "s2-cierre",
        title: "Cierre de la semana",
        items: [
          { id: "a", label: "Nombré clase, objeto, atributo, método, constructor y visibilidad en Ejemplar" },
          { id: "b", label: "Definí las cuatro técnicas con una frase y un ejemplo cada una" },
          { id: "c", label: "Resolví el ejercicio de la técnica y leí por qué" },
        ],
      },
    ],
  },
  {
    week: 3,
    title: "Herramienta de modelado y técnicas aplicadas",
    syllabus: [
      "Utiliza herramienta de modelado.",
      "Aplica las técnicas de programación orientada a objetos.",
    ],
    summary:
      "La herramienta de modelado dibuja clases, atributos, métodos y relaciones. Aplicar una técnica es cambiar el modelo para que el dato quede oculto, la clase hija reutilice a la padre y el mismo mensaje tenga respuestas distintas.",
    minutes: 60,
    objectives: [
      "Crear una clase en una herramienta de modelado con atributos, métodos y visibilidad.",
      "Aplicar encapsulamiento, herencia y polimorfismo sobre ese modelo.",
      "Leer el diagrama como la decisión, no como el dibujo.",
    ],
    blocks: [
      {
        type: "paragraphs",
        paragraphs: [
          "Cualquier herramienta de modelado UML sirve esta semana: StarUML, diagrams.net u otra del mismo tipo. Lo que se practica es la operación, no la marca. Se crea un diagrama de clases, se añade una clase, se declaran miembros y se traza una generalización.",
          "Modelar sin aplicar técnicas produce un rectángulo con datos públicos. Aplicar las técnicas cambia ese rectángulo.",
        ],
      },
      { type: "section", id: "lectura", title: "Cómo se usa la herramienta" },
      {
        type: "steps",
        title: "Secuencia mínima en el modelador",
        steps: [
          {
            title: "Diagrama de clases",
            body: "Crea un diagrama vacío. Nómbralo Prestamo. El lienzo es el lugar donde viven las clases de esta semana, no todo el sistema.",
          },
          {
            title: "Clase y miembros",
            body: "Añade Ejemplar. Atributos: - codigo, - titulo, - disponible. Métodos: + prestar(usuario), + devolver(). El signo menos es privado. El más es público.",
          },
          {
            title: "Generalización",
            body: "Crea Material y haz que Libro y Revista hereden de ella. Sube a Material el código, el título y prestar. Deja en cada hija lo que cambia.",
          },
          {
            title: "Operación compartida",
            body: "Declara diasDePrestamo() en Material y en las dos hijas. El mismo nombre, en tres clases, anuncia el polimorfismo que el código tendrá que cumplir.",
          },
          {
            title: "Revisión",
            body: "Exporta o guarda una imagen del diagrama. Si disponible aparece con «+», el encapsulamiento todavía no está aplicado.",
          },
        ],
      },
      {
        type: "code",
        title: "La técnica, antes y después",
        code: `// Sin encapsular: cualquiera pisa el estado
ejemplar.disponible = true

// Aplicado: el objeto custodia la regla
ejemplar.prestar(usuario)
  si no esta disponible, rechaza
  si no, marca prestado y recuerda a quien`,
      },
      {
        type: "callout",
        tone: "tip",
        title: "Herencia y polimorfismo en el mismo diagrama",
        body: "La flecha de generalización dice que Libro es un Material. diasDePrestamo() en las dos hijas dice que el mensaje es uno y la respuesta depende de la clase real del objeto.",
      },
      { type: "section", id: "practica", title: "Práctica" },
      {
        type: "quiz",
        id: "s3-modelo",
        title: "Qué falta en el modelo",
        prompt:
          "En el diagrama, Libro y Revista repiten codigo, titulo y prestar(). No existe una clase padre. diasDePrestamo() no aparece.",
        options: [
          {
            id: "enc",
            label: "Falta encapsular un atributo público",
            ok: false,
            why: "El problema que describe el enunciado es duplicación y ausencia del mensaje común, no la visibilidad de un dato.",
          },
          {
            id: "her",
            label: "Falta extraer Material y declarar el mensaje común",
            ok: true,
            why: "La herencia saca lo repetido a Material. El método diasDePrestamo() en padre e hijas deja el polimorfismo escrito en el modelo.",
          },
          {
            id: "abs",
            label: "Falta borrar los atributos para abstraer",
            ok: false,
            why: "Abstraer no es dejar la clase vacía. Es quedarse con codigo, titulo y las operaciones del préstamo.",
          },
        ],
      },
      {
        type: "checklist",
        id: "s3-cierre",
        title: "Cierre de la semana",
        items: [
          { id: "a", label: "Abrí un diagrama de clases en la herramienta y creé Ejemplar con visibilidad" },
          { id: "b", label: "Modelé Material, Libro y Revista con generalización" },
          { id: "c", label: "Dejé diasDePrestamo() como mensaje común y comprobé el ejercicio" },
        ],
      },
    ],
  },
  {
    week: 4,
    title: "Aplicaciones orientadas a objetos y modelamiento de clases",
    syllabus: [
      "Conoce el uso de las aplicaciones orientadas a objetos.",
      "Realiza el modelamiento de Clases.",
    ],
    summary:
      "Una aplicación orientada a objetos resuelve un trabajo porque sus objetos colaboran en tiempo de ejecución. El modelamiento de clases deja por escrito esas colaboraciones: atributos, métodos y relaciones.",
    minutes: 60,
    objectives: [
      "Explicar para qué se usa una aplicación construida con objetos.",
      "Modelar clases con asociación, agregación, composición y generalización.",
      "Leer la multiplicidad de una relación.",
    ],
    blocks: [
      {
        type: "paragraphs",
        paragraphs: [
          "El uso de una aplicación orientada a objetos es sostener un trabajo real con objetos que se envían mensajes: registrar un préstamo, impedir un segundo préstamo del mismo ejemplar, calcular la fecha de devolución. La pantalla y la base de datos existen, pero la regla del negocio vive en las clases.",
          "Modelar clases es decidir qué clases hay, qué recuerda cada una y cómo se relacionan. El dibujo es el registro de esa decisión.",
        ],
      },
      { type: "section", id: "lectura", title: "Modelamiento" },
      {
        type: "classDiagram",
        title: "Clases del préstamo",
        caption: "Cada caja es una clase. La lista de abajo dice cómo se conectan.",
        classes: [
          {
            name: "Biblioteca",
            attributes: ["- nombre"],
            methods: ["+ recibir(ejemplar)"],
          },
          {
            name: "Ejemplar",
            attributes: ["- codigo", "- disponible"],
            methods: ["+ prestar(usuario)", "+ devolver()"],
          },
          {
            name: "Prestamo",
            attributes: ["- fechaSalida", "- fechaLimite"],
            methods: ["+ estaVencido()"],
          },
          {
            name: "Usuario",
            attributes: ["- codigo", "- nombre"],
            methods: ["+ solicitar(ejemplar)"],
          },
        ],
        relations: [
          "Biblioteca 1 ◆—— * Ejemplar: composición. El ejemplar catalogado pertenece a esa biblioteca.",
          "Usuario 1 —— * Prestamo: asociación. Una persona puede tener varios préstamos a lo largo del tiempo.",
          "Prestamo * —— 1 Ejemplar: asociación. Cada préstamo apunta a un ejemplar.",
          "Material <|—— Libro y Material <|—— Revista: generalización, cuando Libro y Revista comparten el préstamo.",
        ],
      },
      {
        type: "cards",
        title: "Cuatro relaciones",
        items: [
          {
            kicker: "Asociación",
            title: "Se conocen",
            body: "Prestamo conoce a un Usuario y a un Ejemplar. Ninguno está hecho de los otros. Si se cancela el préstamo, la persona y el ejemplar siguen existiendo.",
          },
          {
            kicker: "Agregación",
            title: "El todo reúne partes que pueden salir",
            body: "Una estantería agrupa ejemplares. El ejemplar puede cambiar de estantería. La parte no muere con el agrupador.",
          },
          {
            kicker: "Composición",
            title: "La parte vive con el todo",
            body: "El ejemplar de esta biblioteca se da de baja con ella en el modelo del curso: no tiene sentido en el catálogo si la biblioteca desaparece. El rombo va lleno del lado del todo.",
          },
          {
            kicker: "Generalización",
            title: "Es un",
            body: "Libro es un Material. La flecha apunta a la clase general. Abajo queda lo específico.",
          },
        ],
      },
      {
        type: "callout",
        tone: "note",
        title: "Multiplicidad",
        body: "1 significa uno. * significa varios. «Usuario 1 —— * Prestamo» se lee: una persona, muchos préstamos; cada préstamo, una persona. Si la multiplicidad no se puede leer en voz alta, falta en el diagrama.",
      },
      { type: "section", id: "practica", title: "Práctica" },
      {
        type: "quiz",
        id: "s4-relacion",
        title: "Qué relación es",
        prompt:
          "Un préstamo recuerda a qué usuario y a qué ejemplar corresponde. Si el préstamo se anula, el usuario y el ejemplar continúan en el sistema.",
        options: [
          {
            id: "comp",
            label: "Composición",
            ok: false,
            why: "En la composición, la parte no sobrevive sola al todo. Aquí usuario y ejemplar sobreviven al préstamo.",
          },
          {
            id: "asoc",
            label: "Asociación",
            ok: true,
            why: "Las tres clases se conocen y cada una tiene vida propia. Eso es asociación, con multiplicidad.",
          },
          {
            id: "gen",
            label: "Generalización",
            ok: false,
            why: "Generalización sería «Préstamo es un usuario», y esa frase es falsa.",
          },
        ],
      },
      {
        type: "checklist",
        id: "s4-cierre",
        title: "Cierre de la semana",
        items: [
          { id: "a", label: "Expliqué qué trabajo resuelve la aplicación de préstamos" },
          { id: "b", label: "Dibujé Biblioteca, Ejemplar, Prestamo y Usuario con multiplicidad" },
          { id: "c", label: "Distinguí asociación, composición y generalización en el ejercicio" },
        ],
      },
    ],
  },
  {
    week: 5,
    title: "UML y lo común del paradigma",
    syllabus: [
      "Emplea los conceptos del lenguaje UML.",
      "Establece elementos en común de cómo funciona el paradigma de la POO.",
    ],
    summary:
      "UML es el lenguaje con el que se escriben los modelos: símbolos, no un proceso. El paradigma, en todas las clases, repite lo mismo: responsabilidad, colaboración por mensajes y ocultamiento del estado.",
    minutes: 55,
    objectives: [
      "Emplear la notación UML de una clase, una relación y una multiplicidad.",
      "Nombrar qué tienen en común todas las clases de un diseño orientado a objetos.",
      "Leer el diagrama del préstamo con vocabulario UML.",
    ],
    blocks: [
      {
        type: "paragraphs",
        paragraphs: [
          "UML (Unified Modeling Language) es un lenguaje de modelado. Emplear sus conceptos es usar los símbolos con el significado acordado: el compartimento de atributos, el de operaciones, la visibilidad, la asociación y la generalización. UML no dice en qué orden programar. Dice cómo se ve el modelo.",
          "Al recorrer varias clases aparece lo común del paradigma. No es un adorno de cada diagrama: es la manera en que funciona la POO en cualquiera de ellas.",
        ],
      },
      { type: "section", id: "lectura", title: "Conceptos UML que se emplean" },
      {
        type: "cards",
        title: "Lo que se lee en un diagrama de clases",
        items: [
          {
            kicker: "Clase",
            title: "Tres compartimentos",
            body: "Nombre, atributos y operaciones. Ejemplar / - codigo / + prestar(usuario). Eso ya es UML.",
          },
          {
            kicker: "Visibilidad",
            title: "+ − #",
            body: "Público, privado y protegido. El protegido lo ven la propia clase y quienes heredan de ella.",
          },
          {
            kicker: "Asociación",
            title: "Línea entre clases",
            body: "Une clases que se conocen. Los números en los extremos son la multiplicidad.",
          },
          {
            kicker: "Generalización",
            title: "Flecha con triángulo vacío",
            body: "Apunta a la clase general. Libro apunta a Material porque un libro es un material.",
          },
        ],
      },
      {
        type: "cards",
        title: "Lo que el paradigma repite en todas las clases",
        items: [
          {
            kicker: "Responsabilidad",
            title: "Cada clase responde por algo",
            body: "Ejemplar responde por su disponibilidad. Prestamo responde por las fechas. Usuario responde por su identidad de lector. Si una clase hace las tres cosas, el paradigma se rompió.",
          },
          {
            kicker: "Colaboración",
            title: "El trabajo sale de mensajes",
            body: "Usuario no abre la lista interna de la biblioteca. Le pide a Biblioteca o a Ejemplar lo que necesita. Todas las clases colaboran así.",
          },
          {
            kicker: "Ocultamiento",
            title: "El estado no es público",
            body: "En Ejemplar, en Prestamo y en Usuario el dato que sostiene la regla va privado. Cambia por una operación. Es el mismo mecanismo en todas.",
          },
          {
            kicker: "Instancia",
            title: "La clase no hace el préstamo",
            body: "El préstamo ocurre entre instancias: este usuario, este ejemplar, este préstamo. La clase solo describe. Eso vale para cualquier clase del paradigma.",
          },
        ],
      },
      {
        type: "flip",
        title: "UML o paradigma",
        hint: "Clasifica la frase del reverso: ¿habla del lenguaje o de cómo funciona la POO?",
        cards: [
          {
            front: "El signo menos delante de un atributo",
            back: "Es UML: notación de visibilidad privada. El paradigma que esa notación expresa es el ocultamiento.",
          },
          {
            front: "Ninguna clase modifica el estado de otra por dentro",
            back: "Es el paradigma. UML solo alcanza a mostrarlo si los atributos van privados y las operaciones, públicas.",
          },
          {
            front: "La flecha de generalización apunta a Material",
            back: "Es UML. El paradigma detrás es la herencia: Libro es un Material y reutiliza su responsabilidad.",
          },
          {
            front: "Toda clase tiene una responsabilidad reconocible",
            back: "Es el paradigma, en todas las clases. UML no obliga a escribir esa frase, pero un buen modelo la deja ver.",
          },
        ],
      },
      { type: "section", id: "practica", title: "Práctica" },
      {
        type: "quiz",
        id: "s5-comun",
        title: "Elemento común",
        prompt:
          "Ejemplar, Prestamo y Usuario guardan sus datos con signo menos y ofrecen operaciones con signo más. ¿Qué está establecido ahí?",
        options: [
          {
            id: "solo",
            label: "Solo una convención gráfica sin efecto en el diseño",
            ok: false,
            why: "El signo es UML, y a la vez deja ver el ocultamiento, que es común a las tres clases.",
          },
          {
            id: "ocult",
            label: "El ocultamiento del estado, repetido en todo el paradigma",
            ok: true,
            why: "Las tres clases funcionan igual: el dato está oculto y el mensaje es público. Eso es común al paradigma, escrito con notación UML.",
          },
          {
            id: "her",
            label: "Que las tres clases heredan de una sola padre",
            ok: false,
            why: "Compartir el mecanismo no es heredar. No hay flecha de generalización entre esas tres.",
          },
        ],
      },
      {
        type: "checklist",
        id: "s5-cierre",
        title: "Cierre de la semana",
        items: [
          { id: "a", label: "Leí una clase UML en voz alta: nombre, atributos, operaciones y visibilidad" },
          { id: "b", label: "Señalé responsabilidad, colaboración y ocultamiento en tres clases" },
          { id: "c", label: "Separé qué es símbolo UML y qué es el paradigma" },
        ],
      },
    ],
  },
  {
    week: 6,
    title: "Casos de uso e interfaces",
    syllabus: [
      "Aplica los diagramas de casos de uso.",
      "Utiliza el diseño de aplicaciones con un correcto uso de las clases Interfaces.",
    ],
    summary:
      "El diagrama de casos de uso muestra quién usa el sistema y para qué, visto desde fuera. La interfaz, por dentro, es el contrato que el resto de la aplicación usa sin depender de una clase concreta.",
    minutes: 60,
    objectives: [
      "Aplicar un diagrama de casos de uso con actores, sistema y relaciones.",
      "Usar una interfaz como contrato entre quien pide y quien implementa.",
      "Evitar que la aplicación dependa de una clase concreta cuando solo necesita el contrato.",
    ],
    blocks: [
      {
        type: "paragraphs",
        paragraphs: [
          "Aplicar un diagrama de casos de uso es nombrar actores y objetivos observables. No se dibujan pantallas ni tablas. Se dibuja el límite del sistema y lo que alguien logra con él.",
          "Una clase interfaz declara operaciones y no dice cómo se cumplen. Quien diseña la aplicación programa contra esa interfaz. La clase concreta puede cambiar sin que el resto se entere.",
        ],
      },
      { type: "section", id: "lectura", title: "Casos de uso" },
      {
        type: "usecase",
        title: "Préstamo visto desde fuera",
        system: "Biblioteca",
        actors: ["Usuario", "Bibliotecario"],
        cases: [
          "Consultar disponibilidad",
          "Registrar préstamo",
          "Devolver ejemplar",
          "Validar usuario",
        ],
        notes: [
          "Usuario se asocia con Consultar disponibilidad, Registrar préstamo y Devolver ejemplar.",
          "Bibliotecario también registra préstamos cuando atiende el mostrador.",
          "Registrar préstamo incluye Validar usuario: siempre ocurre, no es opcional.",
          "Aplicar sanción extiende Devolver ejemplar: solo si el ejemplar vuelve fuera de plazo.",
        ],
      },
      {
        type: "compare",
        title: "Include y extend",
        leftTitle: "Include",
        rightTitle: "Extend",
        rows: [
          ["El caso base siempre ejecuta al incluido.", "El caso extensión ocurre solo a veces."],
          ["Registrar préstamo incluye validar usuario.", "Devolver se extiende con aplicar sanción si hay retraso."],
          ["La flecha apunta al caso incluido.", "La flecha de extend apunta al caso base."],
        ],
      },
      { type: "section", id: "interfaces", title: "Clases interfaz" },
      {
        type: "code",
        title: "Contrato y dos implementaciones",
        code: `interfaz Catalogo
  buscar(codigo)
  apartar(codigo, usuario)

clase CatalogoEnMemoria implementa Catalogo
  guarda los ejemplares en una lista

clase CatalogoEnArchivo implementa Catalogo
  guarda los ejemplares en disco

clase ServicioPrestamo
  conoce un Catalogo, no una lista ni un archivo
  al prestar, llama catalogo.apartar(...)`,
      },
      {
        type: "callout",
        tone: "tip",
        title: "Uso correcto de la interfaz",
        body: "ServicioPrestamo no pregunta si el catálogo es memoria o archivo. Solo usa buscar y apartar. Esa es la frontera. Si el servicio recorre la lista interna de CatalogoEnMemoria, la interfaz está de adorno.",
      },
      {
        type: "flip",
        title: "Contrato o caso de uso",
        hint: "El anverso es una frase del diseño. El reverso dice en qué artefacto vive.",
        cards: [
          {
            front: "El usuario quiere saber si el ejemplar está libre",
            back: "Es un caso de uso: Consultar disponibilidad. Lo ve el actor. No es una interfaz.",
          },
          {
            front: "buscar(codigo) y apartar(codigo, usuario)",
            back: "Es la interfaz Catalogo. La usa otra clase del programa, no la persona en el mostrador.",
          },
          {
            front: "Siempre se valida al usuario antes de prestar",
            back: "Es include entre casos de uso. No es herencia ni interfaz.",
          },
          {
            front: "CatalogoEnArchivo cumple el mismo contrato que CatalogoEnMemoria",
            back: "Las dos clases implementan la interfaz. ServicioPrestamo puede recibir cualquiera de las dos.",
          },
        ],
      },
      { type: "section", id: "practica", title: "Práctica" },
      {
        type: "quiz",
        id: "s6-interfaz",
        title: "Dónde está el error de diseño",
        prompt:
          "ServicioPrestamo recibe un CatalogoEnMemoria y recorre su lista de ejemplares para marcarlo prestado, sin llamar a apartar().",
        options: [
          {
            id: "ok",
            label: "Está bien: así se aprovecha la implementación",
            ok: false,
            why: "Aprovechar la lista ata el servicio a una clase concreta. Mañana el archivo no tiene esa lista.",
          },
          {
            id: "mal",
            label: "El servicio debe depender de Catalogo y llamar a apartar()",
            ok: true,
            why: "El contrato es la interfaz. La lista es detalle de CatalogoEnMemoria y no sale de esa clase.",
          },
          {
            id: "uc",
            label: "El error es de casos de uso: falta un actor",
            ok: false,
            why: "El fallo está dentro de la aplicación, en quién conoce a quién. El diagrama de casos de uso no lo corrige.",
          },
        ],
      },
      {
        type: "checklist",
        id: "s6-cierre",
        title: "Cierre de la semana",
        items: [
          { id: "a", label: "Dibujé actores, límite del sistema y los casos del préstamo" },
          { id: "b", label: "Marqué un include y un extend con su condición" },
          { id: "c", label: "Dejé ServicioPrestamo dependiendo de Catalogo, no de la lista" },
        ],
      },
    ],
  },
  {
    week: 7,
    title: "Herramienta CASE y clases abstractas",
    syllabus: [
      "Recursos web sobre el uso de una herramienta CASE en particular.",
      "Reconoce los conceptos relacionados con clases abstractas.",
    ],
    summary:
      "La herramienta CASE de esta semana es StarUML. Los recursos web oficiales enseñan a crear el diagrama. En ese diagrama, una clase abstracta declara un mensaje que todavía no cumple y no puede instanciarse.",
    minutes: 50,
    objectives: [
      "Consultar la documentación web de StarUML para crear un diagrama de clases.",
      "Reconocer una clase abstracta, un método abstracto y la prohibición de instanciarla.",
      "Diferenciar clase abstracta e interfaz.",
    ],
    blocks: [
      {
        type: "paragraphs",
        paragraphs: [
          "CASE significa ingeniería de software asistida por computador: la herramienta guarda el modelo, no solo el dibujo. Esta semana la herramienta particular es StarUML. El trabajo de consulta es seguir, en la documentación publicada por el proyecto, cómo se crea un diagrama de clases, cómo se añade una clase y cómo se exporta.",
          "Con esa herramienta se dibuja Material como clase abstracta. El nombre va en cursiva. diasDePrestamo() también, porque la padre exige el mensaje y no lo resuelve.",
        ],
      },
      { type: "section", id: "lectura", title: "Consulta web" },
      {
        type: "links",
        title: "StarUML, documentación del propio proyecto",
        items: [
          {
            name: "Sitio de StarUML",
            href: "https://staruml.io/",
            note: "Presentación de la herramienta y acceso a la descarga.",
          },
          {
            name: "Guías de uso",
            href: "https://docs.staruml.io/",
            note: "Documentación para crear diagramas, editar clases y exportar el modelo.",
          },
        ],
      },
      {
        type: "steps",
        title: "Qué buscar en esa documentación",
        steps: [
          {
            title: "Crear el diagrama",
            body: "Localiza cómo abrir un diagrama de clases nuevo dentro de un modelo. El resultado de la consulta es poder repetir esos pasos, no copiar la página.",
          },
          {
            title: "Marcar una clase abstracta",
            body: "Busca la propiedad de clase abstracta. En el diagrama el nombre queda en cursiva. Anota en qué panel está esa propiedad en la versión que abras.",
          },
          {
            title: "Exportar",
            body: "Encuentra cómo exportar a imagen o a PDF para llevar el diagrama a la entrega. Guarda también el archivo del modelo, que es lo que la herramienta CASE conserva.",
          },
        ],
      },
      { type: "section", id: "abstractas", title: "Clases abstractas" },
      {
        type: "cards",
        title: "Qué se reconoce",
        items: [
          {
            kicker: "Clase abstracta",
            title: "No se crea con new",
            body: "Material no produce objetos. No hay un material que no sea libro, revista u otra hija concreta.",
          },
          {
            kicker: "Método abstracto",
            title: "Obligación sin cuerpo",
            body: "diasDePrestamo() en Material no tiene implementación. Libro y Revista están obligadas a escribirlo.",
          },
          {
            kicker: "Implementación parcial",
            title: "La padre sí puede tener código",
            body: "prestar() puede vivir completo en Material, porque la regla de disponible es común. Lo abstracto es solo lo que cambia.",
          },
          {
            kicker: "Frente a la interfaz",
            title: "La abstracta puede guardar estado",
            body: "Material tiene codigo y titulo. Catalogo, la interfaz de la semana 6, solo declara operaciones. Las dos obligan; no son la misma pieza.",
          },
        ],
      },
      {
        type: "code",
        title: "Lo que el lenguaje debe impedir",
        code: `abstracta clase Material
  - codigo
  - titulo
  + prestar(usuario)    // con cuerpo, regla común
  abstracto diasDePrestamo()

clase Libro hereda Material
  diasDePrestamo() devuelve 15

m = new Material()      // no es válido
l = new Libro(...)      // sí es válido
l.diasDePrestamo()      // 15`,
      },
      { type: "section", id: "practica", title: "Práctica" },
      {
        type: "quiz",
        id: "s7-abstracta",
        title: "Reconocer el concepto",
        prompt: "¿Cuál de estas frases describe a Material en el modelo del préstamo?",
        options: [
          {
            id: "inst",
            label: "Se puede instanciar y cada objeto elige luego si es libro o revista",
            ok: false,
            why: "Una clase abstracta no se instancia. El objeto nace ya como Libro o como Revista.",
          },
          {
            id: "abs",
            label: "No se instancia, exige diasDePrestamo() y puede implementar prestar()",
            ok: true,
            why: "Eso reúne los tres conceptos: clase abstracta, método abstracto e implementación parcial.",
          },
          {
            id: "inter",
            label: "Es una interfaz porque tiene un método sin cuerpo",
            ok: false,
            why: "Un método sin cuerpo no basta. Material además guarda atributos y un método con cuerpo. Eso es clase abstracta, no interfaz.",
          },
        ],
      },
      {
        type: "checklist",
        id: "s7-cierre",
        title: "Cierre de la semana",
        items: [
          { id: "a", label: "Abrí la documentación de StarUML y ubiqué cómo crear un diagrama de clases" },
          { id: "b", label: "Marqué Material como abstracta y diasDePrestamo() como método abstracto" },
          { id: "c", label: "Expliqué en una frase en qué se diferencia de la interfaz Catalogo" },
        ],
      },
    ],
  },
  {
    week: 8,
    title: "Errores, validaciones y depuración",
    syllabus: [
      "Construye el proceso de tratamiento de errores.",
      "Implementa los procesos de validaciones y depuraciones.",
    ],
    summary:
      "Tratar un error es un proceso: detectar, avisar, decidir y dejar el objeto en un estado válido. Validar ocurre antes de cambiar ese estado. Depurar es seguir el proceso cuando el programa no hace lo que el modelo dice.",
    minutes: 65,
    objectives: [
      "Construir la secuencia de tratamiento de un error de préstamo.",
      "Implementar validaciones que rechacen el estado imposible.",
      "Depurar un fallo reproduciendo, inspeccionando y corrigiendo.",
    ],
    blocks: [
      {
        type: "paragraphs",
        paragraphs: [
          "Un ejemplar no puede quedar prestado dos veces. Un préstamo no puede nacer con fecha límite anterior a la salida. Esos fallos no se esconden: el objeto los detecta y el proceso dice qué pasa después.",
          "Validar es impedir el cambio. Depurar es averiguar por qué un cambio inválido ocurrió igual. Son procesos distintos y esta semana pide los dos.",
        ],
      },
      { type: "section", id: "lectura", title: "Proceso de tratamiento" },
      {
        type: "steps",
        title: "Qué ocurre cuando prestar falla",
        steps: [
          {
            title: "Detectar",
            body: "prestar() revisa sus reglas: hay usuario, el ejemplar está disponible, la fecha límite es posterior a hoy.",
          },
          {
            title: "No cambiar el estado",
            body: "Si una regla falla, disponible sigue como estaba. Un error no deja el objeto a medias.",
          },
          {
            title: "Avisar",
            body: "El método lanza una excepción con el motivo: ejemplar ocupado, usuario ausente o fecha inválida. El motivo se puede distinguir.",
          },
          {
            title: "Decidir arriba",
            body: "Quien llamó a prestar captura la excepción. Informa a la persona, registra el intento o pide otro ejemplar. Esa decisión no vive dentro de Ejemplar.",
          },
          {
            title: "Cerrar",
            body: "El flujo termina con el objeto consistente y con alguien informado. Tragar la excepción y seguir como si el préstamo existiera rompe el proceso.",
          },
        ],
      },
      {
        type: "code",
        title: "Validación dentro de prestar",
        code: `prestar(usuario, fechaLimite)
  si usuario es nulo
    lanzar ErrorValidacion("falta el usuario")
  si no disponible
    lanzar ErrorValidacion("ejemplar ocupado")
  si fechaLimite es anterior a hoy
    lanzar ErrorValidacion("fecha limite invalida")
  disponible = falso
  this.usuario = usuario
  this.fechaLimite = fechaLimite`,
      },
      {
        type: "callout",
        tone: "note",
        title: "Validar no es depurar",
        body: "La validación es código que se queda en el programa. La depuración es el trabajo de quien busca un fallo: se reproduce, se observa el estado y se corrige. Cuando el fallo ya no se reproduce, la depuración terminó. La validación sigue.",
      },
      { type: "section", id: "practica", title: "Depuración" },
      {
        type: "sort",
        id: "s8-depurar",
        title: "Orden del proceso de depuración",
        instructions: "Reordena los pasos de una depuración. El fallo de ejemplo: prestar() marca el ejemplar como prestado aunque el usuario llegue nulo.",
        success: "Primero se reproduce, luego se supone la causa, se observa el estado, se corrige y se vuelve a ejecutar el mismo caso.",
        items: [
          { id: "corregir", label: "Corregir la validación que faltó" },
          { id: "repro", label: "Reproducir el fallo con un usuario nulo" },
          { id: "retest", label: "Volver a ejecutar ese mismo caso" },
          { id: "observar", label: "Poner un punto de interrupción y mirar usuario y disponible" },
          { id: "hipotesis", label: "Suponer en qué línea el estado cambió de más" },
        ],
        correct: ["repro", "hipotesis", "observar", "corregir", "retest"],
      },
      {
        type: "quiz",
        id: "s8-proceso",
        title: "Tratamiento o parche",
        prompt:
          "prestar() atrapa su propia excepción, la ignora y devuelve el ejemplar igual, con disponible en verdadero aunque nadie lo haya prestado.",
        options: [
          {
            id: "bien",
            label: "Es un buen tratamiento: el programa no se cae",
            ok: false,
            why: "No caerse no alcanza. El llamador cree que nada pasó y el motivo del error desapareció.",
          },
          {
            id: "mal",
            label: "El proceso está incompleto: hay que avisar y no simular un éxito",
            ok: true,
            why: "Detectar sin decidir y sin informar rompe el tratamiento. La excepción tiene que llegar a quien puede hablar con la persona usuaria.",
          },
          {
            id: "dep",
            label: "Eso es depuración, y con eso basta",
            ok: false,
            why: "Depurar es investigar un fallo. Aquí el fallo es de diseño del proceso: se está ocultando el error en el código definitivo.",
          },
        ],
      },
      {
        type: "checklist",
        id: "s8-cierre",
        title: "Cierre de la semana",
        items: [
          { id: "a", label: "Escribí las validaciones de usuario, disponibilidad y fecha" },
          { id: "b", label: "Dejé el tratamiento en cinco pasos: detectar, no cambiar, avisar, decidir, cerrar" },
          { id: "c", label: "Depuré el caso del usuario nulo en el orden comprobado" },
        ],
      },
    ],
  },
];

export const WEEKS = RAW.map((week) => {
  const blocks = week.blocks.map((block) => {
    if (block.type !== "checklist") return block;
    return {
      ...block,
      items: [
        ...block.items,
        {
          id: "plantilla",
          label: "Descargué la hoja de ruta y completé el formato en blanco",
        },
        {
          id: "word",
          label: "Completé la plantilla Word alineada a la norma de esta semana",
        },
      ],
    };
  });
  const closeAt = blocks.findIndex((block) => block.type === "checklist");
  blocks.splice(closeAt, 0, ...extrasFor(week.week), ...complementFor(week.week));
  return { ...week, minutes: Math.min(week.minutes + 25, 90), blocks };
});

export function getWeek(number) {
  return WEEKS.find((week) => week.week === number);
}
