const general = {
  1: {
    paragraphs: [
      "Un paradigma es una decisión de diseño: qué cosas cuentan como unidades del programa. En la programación orientada a objetos esas unidades son objetos. Un objeto tiene identidad, recuerda un estado y responde a mensajes. La clase es la descripción compartida; el objeto es el caso concreto.",
      "Esto no depende de la biblioteca del curso. Una cuenta bancaria, un sensor de temperatura o un pedido en una tienda obedecen la misma idea: el dato no viaja suelto de función en función. Vive en el objeto, y otro objeto le pide un comportamiento. Java, Python o C# pueden usarse así, o pueden usarse como una lista de procedimientos.",
    ],
    cards: [
      ["Identidad", "El objeto sigue siendo el mismo aunque cambien sus datos."],
      ["Estado", "Lo que el objeto recuerda en un momento."],
      ["Mensaje", "La petición de un objeto a otro. No es una asignación hecha desde fuera."],
    ],
  },
  2: {
    paragraphs: [
      "Los elementos del paradigma se repiten en cualquier dominio: clase, objeto, atributo, método y mensaje. La clase declara atributos y métodos. El objeto guarda los valores. El método es el comportamiento. El mensaje es la forma en que otro objeto lo dispara.",
      "Dos técnicas ordenan ese vocabulario. La abstracción se queda con lo que importa al problema y deja fuera el resto. El encapsulamiento esconde los atributos detrás de métodos, para que el estado solo cambie por un camino previsto. Sin esas técnicas, una clase es solo un registro con funciones al lado.",
    ],
    cards: [
      ["Atributo", "Un dato que pertenece al objeto, no al programa completo."],
      ["Método", "Una operación de la clase. Puede consultar o cambiar el estado."],
      ["Encapsulamiento", "El exterior usa el método. No reescribe el atributo a su antojo."],
    ],
  },
  3: {
    paragraphs: [
      "Modelar es decidir la estructura antes de escribir el programa. Un modelo nombra clases, relaciones y multiplicidades: una universidad tiene muchos estudiantes; un estudiante cursa un programa. La herramienta de modelado guarda esa decisión para que el equipo la vea igual.",
      "La asociación dice que dos objetos se conocen. La multiplicidad dice cuántos. Herencia, dependencia y realización son otros vínculos, y no se dibujan igual porque no significan lo mismo. Aplicar la técnica es pasar del dibujo a clases que conservan ese vínculo en el código.",
    ],
    cards: [
      ["Asociación", "Un objeto conoce a otro durante el problema."],
      ["Multiplicidad", "1, 0..1 o * indican cuántos participan en cada extremo."],
      ["Modelo", "Una decisión compartida. El código viene después y tiene que respetarla."],
    ],
  },
  4: {
    paragraphs: [
      "Una aplicación orientada a objetos es un conjunto de clases que colaboran, no una pantalla con datos sueltos. Modelar clases empieza por responsabilidades: qué recuerda cada una y qué se le puede pedir. Los sustantivos del problema son candidatos; no todos merecen una clase.",
      "La generalización aparece cuando varios tipos son un caso de otro. Un libro y una revista son material. Un préstamo no lo es. La relación «es un» se dibuja de los hijos hacia el padre. Confundirla con «tiene un» produce jerarquías que el programa no puede sostener.",
    ],
    cards: [
      ["Responsabilidad", "Lo que la clase sabe y lo que la clase hace."],
      ["Es un", "El hijo puede ocupar el lugar del padre."],
      ["Tiene un", "Una clase contiene o conoce a otra. Eso es asociación, no herencia."],
    ],
  },
  5: {
    paragraphs: [
      "UML es un lenguaje de diagramas, no el programa. Sirve para que dos personas hablen de la misma estructura: clases, casos de uso, secuencias o estados. Un diagrama de clases muestra nombre, atributos y operaciones, a menudo con visibilidad y tipo.",
      "Lo común del paradigma no cambia con el diagrama. En cualquier lenguaje orientado a objetos hay objetos, clases y mensajes. UML solo les da una forma estable de escribirse. El signo − suele marcar un atributo privado y + una operación pública. El tipo va después del nombre.",
    ],
    cards: [
      ["− atributo", "Visible para la propia clase. El exterior no lo usa directo."],
      ["+ operación", "Visible para quien envía el mensaje."],
      ["Tipo", "Dice qué valores puede recordar el atributo o devolver la operación."],
    ],
  },
  6: {
    paragraphs: [
      "Un caso de uso describe una meta de un actor frente a un sistema: prestar un ejemplar, registrar un pago, cerrar un pedido. No describe botones ni tablas. El actor queda fuera del borde; los casos, dentro. El nombre es un verbo en la voz del actor.",
      "Una interfaz es un contrato. Quien la usa conoce las operaciones y desconoce la clase concreta. Por eso un catálogo puede cumplirlo una biblioteca en memoria o un servicio remoto. Depender del contrato, y no de una clase fija, es lo que permite cambiar la implementación sin reescribir al cliente.",
    ],
    cards: [
      ["Actor", "Persona o sistema externo con una meta."],
      ["Caso de uso", "La meta, no el control de la pantalla."],
      ["Interfaz", "Operaciones prometidas. Varias clases pueden cumplirlas."],
    ],
  },
  7: {
    paragraphs: [
      "Una herramienta CASE guarda el modelo, las relaciones y, a veces, el esqueleto del código. El valor no está en el dibujo bonito: está en que la decisión de diseño queda registrada y se puede revisar. StarUML es la herramienta de este curso; el hábito vale para cualquier otra.",
      "Una clase abstracta reúne lo común de una familia y deja incompleto lo que cada hijo debe resolver. No se instancia, porque todavía no es un objeto completo. Material puede exigir prestar() y no saber cómo presta un libro o una revista. El hijo concreto completa ese método.",
    ],
    cards: [
      ["CASE", "El modelo vive en una herramienta, no solo en la memoria del equipo."],
      ["Clase abstracta", "Contrato parcial más datos comunes. No se construye."],
      ["Clase concreta", "Completa lo que la abstracta dejó pendiente y sí se instancia."],
    ],
  },
  8: {
    paragraphs: [
      "El tratamiento de errores es parte del diseño, no un parche al final. Antes de cambiar el estado se valida la entrada y la situación del objeto. Si la validación falla, el objeto no finge que la operación ocurrió: informa el motivo y deja la decisión a quien llamó.",
      "Validar, lanzar un error y depurar no son lo mismo. Validar comprueba una condición. El error interrumpe el camino feliz y transporta el motivo. Depurar es investigar, con el programa en marcha, por qué una condición no se cumplió. Tragar la excepción para que «no se caiga» borra las tres cosas.",
    ],
    cards: [
      ["Validación", "Una condición que se comprueba antes de modificar el estado."],
      ["Error", "El aviso de que la operación no puede cumplirse."],
      ["Depuración", "Observar el fallo, proponer una causa y confirmarla."],
    ],
  },
};

export function teoriaFor(week) {
  const item = general[week];
  return [
    { type: "section", id: "teoria", title: "Teoría general" },
    { type: "paragraphs", paragraphs: item.paragraphs },
    {
      type: "cards",
      title: "Tres ideas que valen fuera de este caso",
      items: item.cards.map(([title, body]) => ({ title, body })),
    },
  ];
}
