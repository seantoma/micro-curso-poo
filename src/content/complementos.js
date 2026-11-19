import { formatoDe } from "./normas.js";

function material(week, paragraphs, pairs, quiz) {
  const formato = formatoDe(week);
  return [
    { type: "section", id: "complemento", title: "Material complementario" },
    { type: "paragraphs", paragraphs },
    {
      type: "callout",
      tone: "note",
      title: `${formato.norm} · ${formato.normName}`,
      body: formato.purpose,
    },
    {
      type: "match",
      id: `c${week}-match`,
      title: "Empareja el término con su uso",
      prompt: "Elige el complemento de cada fila y comprueba.",
      pairs,
    },
    {
      type: "quiz",
      id: `c${week}-norma`,
      title: quiz.title,
      prompt: quiz.prompt,
      options: quiz.options,
    },
    {
      type: "downloads",
      title: "Formato guía en Word",
      items: [
        {
          href: `/plantillas/word/${formato.file}`,
          name: `${formato.id} · ${formato.title}`,
          note: `Plantilla con control de documento, ejemplo del préstamo y filas en blanco. Referencia de estructura: ${formato.norm}.`,
        },
      ],
    },
  ];
}

export function complementFor(week) {
  return COMPLEMENTOS[week] || [];
}

const COMPLEMENTOS = {
  1: material(
    1,
    [
      "En un proyecto, el glosario evita que dos personas usen «clase» para hablar de cosas distintas. La industria lo trata como un ítem de información: cada término tiene definición, ejemplo y un lugar donde se usa.",
      "Completa la plantilla con palabras tuyas. Si la definición no cabe en el ejemplar E-204, todavía está vacía. El texto oficial de la norma no se copia: se usa su manera de ordenar el glosario.",
    ],
    [
      { left: "Identidad", right: "E-204 sigue siendo el mismo ejemplar" },
      { left: "Estado", right: "Pasa de disponible a prestado" },
      { left: "Clase", right: "El molde del que salen muchos ejemplares" },
      { left: "Mensaje", right: "prestar() pedido por otro objeto" },
    ],
    {
      title: "Para qué sirve el glosario",
      prompt: "Dos estudiantes discuten y uno llama «objeto» a la clase Ejemplar escrita en el diagrama.",
      options: [
        { id: "da", label: "Da igual: clase y objeto se usan como sinónimos", ok: false, why: "El glosario existe para impedir ese cruce. La clase describe; el objeto existe." },
        { id: "sep", label: "Hay que separar el término en la ficha y poner un ejemplo de cada uno", ok: true, why: "Eso es el uso del glosario: una fila por término, con ejemplo que no se pueda confundir." },
      ],
    },
  ),
  2: material(
    2,
    [
      "Una ficha de clase es el mínimo que otro equipo puede heredar. IEEE 1016 pide decir qué responsabilidad cubre el elemento de diseño. ISO/IEC 25010 da el idioma de la calidad: encapsular no es un adorno, sostiene la integridad del estado.",
      "En la plantilla, cada técnica tiene que nombrar una característica de calidad. «Queda más ordenado» no alcanza.",
    ],
    [
      { left: "Encapsulamiento", right: "El dato solo cambia dentro del método" },
      { left: "Herencia", right: "Libro reutiliza lo de Material" },
      { left: "Polimorfismo", right: "diasDePrestamo() responde distinto" },
      { left: "Abstracción", right: "Se deja fuera lo que el préstamo no usa" },
    ],
    {
      title: "Calidad, no solo nombres",
      prompt: "disponible es público y cualquiera lo asigna. ¿Qué característica de calidad se pierde?",
      options: [
        { id: "int", label: "La integridad del estado", ok: true, why: "Nadie garantiza que el ejemplar quede prestado a una sola persona. ISO/IEC 25010 llama integridad a esa protección." },
        { id: "vel", label: "La velocidad de la pantalla", ok: false, why: "El fallo es de regla de negocio, no de tiempo de respuesta." },
      ],
    },
  ),
  3: material(
    3,
    [
      "Modelar sin registro es un dibujo. El registro dice qué herramienta se usó, qué decisión quedó en el diagrama y dónde está el archivo. Quien revise el diseño dentro de un mes tiene que poder abrir esa evidencia.",
      "Aplica la técnica en el modelo y anótala en la misma fila. Si disponible sigue público, la fila de encapsulamiento no se puede cerrar.",
    ],
    [
      { left: "Vista", right: "El diagrama de clases, no todo el sistema" },
      { left: "Decisión", right: "disponible queda privado" },
      { left: "Evidencia", right: "El archivo exportado del modelador" },
      { left: "Generalización", right: "Libro y Revista apuntan a Material" },
    ],
    {
      title: "Qué no es evidencia",
      prompt: "El estudiante dice que aplicó encapsulamiento, pero el diagrama exportado muestra disponible con signo más.",
      options: [
        { id: "no", label: "La evidencia contradice la decisión. Hay que corregir el modelo.", ok: true, why: "El registro vale porque se puede comprobar. El archivo es la prueba." },
        { id: "si", label: "Basta con decirlo en clase", ok: false, why: "Sin el diagrama, la decisión no quedó registrada." },
      ],
    },
  ),
  4: material(
    4,
    [
      "El modelamiento de clases se defiende relación por relación. El formato pide tipo, multiplicidad y si la parte sigue viva cuando desaparece el todo. Esa pregunta separa asociación, agregación y composición sin depender de la memoria del rombo.",
      "Una aplicación orientada a objetos se usa cuando esas clases, juntas, hacen el trabajo: aquí, prestar sin duplicar el ejemplar.",
    ],
    [
      { left: "Asociación", right: "Se conocen y cada uno sigue existiendo" },
      { left: "Composición", right: "La parte no tiene sentido sin el todo" },
      { left: "Generalización", right: "Libro es un Material" },
      { left: "Multiplicidad", right: "Cuántos hay en cada extremo" },
    ],
    {
      title: "Lectura de la multiplicidad",
      prompt: "«Usuario 1 —— * Prestamo». ¿Cómo se lee?",
      options: [
        { id: "ok", label: "Una persona puede tener muchos préstamos; cada préstamo es de una persona", ok: true, why: "La multiplicidad se lee en voz alta. Si no sale la frase, el número está de adorno." },
        { id: "mal", label: "Hay un solo préstamo en todo el sistema", ok: false, why: "El asterisco está del lado de Prestamo. Son muchos préstamos por persona." },
      ],
    },
  ),
  5: material(
    5,
    [
      "UML, en ISO/IEC 19505 y en la especificación de OMG, es un lenguaje: símbolos con significado acordado. No dice en qué orden programar. La plantilla obliga a escribir el símbolo y, al lado, el rasgo del paradigma que ese símbolo deja ver.",
      "Si las tres clases ocultan el estado con el signo menos, eso no es herencia entre ellas. Es el mismo mecanismo del paradigma, repetido.",
    ],
    [
      { left: "Signo menos", right: "Atributo privado" },
      { left: "Signo más", right: "Operación pública" },
      { left: "Flecha con triángulo vacío", right: "Generalización" },
      { left: "Responsabilidad", right: "Lo que ninguna otra clase debe hacer" },
    ],
    {
      title: "Lenguaje o paradigma",
      prompt: "Las tres clases usan − en sus atributos. ¿Qué estás estableciendo?",
      options: [
        { id: "par", label: "El ocultamiento, común a todo el paradigma, escrito en UML", ok: true, why: "El signo es el lenguaje. Lo que se repite en todas las clases es el paradigma." },
        { id: "her", label: "Que las tres heredan de una sola padre", ok: false, why: "Compartir el signo no dibuja una flecha de generalización." },
      ],
    },
  ),
  6: material(
    6,
    [
      "ISO/IEC/IEEE 29148 trata el caso de uso como un ítem de requisitos: actor, precondición, flujo y postcondición. El diagrama solo no alcanza para diseñar. La especificación dice qué queda verdad cuando el caso termina.",
      "La interfaz es otro ítem, de diseño. Va en la misma plantilla, debajo, para no mezclar lo que pide la persona usuaria con el contrato que usa ServicioPrestamo.",
    ],
    [
      { left: "Include", right: "Siempre se valida al usuario" },
      { left: "Extend", right: "La sanción solo si hay retraso" },
      { left: "Precondición", right: "Lo que ya es verdad antes de empezar" },
      { left: "Interfaz", right: "apartar(), sin conocer la lista" },
    ],
    {
      title: "Dos documentos, dos lectores",
      prompt: "ServicioPrestamo recorre la lista interna del catálogo en memoria.",
      options: [
        { id: "mal", label: "Rompe el contrato: debe llamar a apartar()", ok: true, why: "La persona ve el caso de uso. La clase vecina solo ve la interfaz." },
        { id: "uc", label: "Es un error del diagrama de casos de uso", ok: false, why: "El caso de uso puede estar bien y el diseño por dentro, mal. Son ítems distintos." },
      ],
    },
  ),
  7: material(
    7,
    [
      "ISO/IEC/IEEE 15289 dice qué debe contener un ítem de información del ciclo de vida: de dónde salió, qué produjo y qué decisión queda. La consulta a StarUML entra ahí: recurso web, paso reproducido y archivo del modelo.",
      "La clase abstracta es la decisión. El registro tiene que decir qué no se puede instanciar y en qué se diferencia de la interfaz de la semana anterior.",
    ],
    [
      { left: "Clase abstracta", right: "Material no nace con new" },
      { left: "Método abstracto", right: "diasDePrestamo() sin cuerpo" },
      { left: "Método con cuerpo", right: "prestar() vive en la padre" },
      { left: "Interfaz", right: "Catalogo no guarda codigo ni titulo" },
    ],
    {
      title: "Qué anotar de la herramienta",
      prompt: "¿Qué deja el registro CASE además del dibujo?",
      options: [
        { id: "url", label: "El recurso consultado, el paso y la decisión de diseño", ok: true, why: "Sin eso, el diagrama no se puede rehacer ni justificar." },
        { id: "logo", label: "Solo el nombre comercial de la herramienta", ok: false, why: "El nombre no dice cómo marcar una clase abstracta en la versión que abriste." },
      ],
    },
  ),
  8: material(
    8,
    [
      "ISO/IEC/IEEE 29119-3 ordena un caso de prueba con precondición, entrada y resultado esperado. Aquí el caso es de validación: si la entrada es inválida, el resultado esperado es el error, y el estado del objeto tiene que quedar escrito.",
      "Un tratamiento que esconde la excepción no se puede registrar: no hay resultado esperado que mostrar. La plantilla obliga a decir qué pasa con disponible después del fallo.",
    ],
    [
      { left: "Precondición", right: "El ejemplar ya está disponible" },
      { left: "Entrada inválida", right: "El usuario llega nulo" },
      { left: "Resultado esperado", right: "ErrorValidacion con un motivo" },
      { left: "Estado después", right: "disponible no cambió" },
    ],
    {
      title: "Caso incompleto",
      prompt: "El caso dice «no debe fallar» y no describe el estado del ejemplar.",
      options: [
        { id: "no", label: "Falta el resultado sobre el objeto. El caso no se puede ejecutar.", ok: true, why: "Sin el estado esperado, no se sabe si la validación protegió el ejemplar o lo dejó a medias." },
        { id: "si", label: "Alcanza con decir que no se cae el programa", ok: false, why: "No caerse no es el resultado. El préstamo pudo quedar fingido." },
      ],
    },
  ),
};
