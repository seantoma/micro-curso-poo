function beat(title, body, tip, figure) {
  return { title, body, tip, figure };
}

const classFig = (name, attributes, methods, extra = {}) => ({
  kind: "class",
  name,
  attributes,
  methods,
  ...extra,
});

const weeks = {
  1: [
    beat(
      "Señalar el objeto",
      "E-204 es un ejemplar concreto: código, título y estado disponible. La clase Ejemplar todavía no está en el estante; es el molde.",
      "En el diagrama de objetos el nombre va subrayado: e204 : Ejemplar.",
      { kind: "sequence", lifelines: ["ana : Usuario", "E-204 : Ejemplar"], messages: [] },
    ),
    beat(
      "Enviar el mensaje",
      "Ana no escribe el campo estado. Envía prestar() y la barra de activación marca el tiempo en que el método corre dentro de E-204.",
      "El mensaje nombra la acción. La asignación nombra la representación.",
      {
        kind: "sequence",
        lifelines: ["ana : Usuario", "E-204 : Ejemplar"],
        messages: [{ from: 0, to: 1, label: "prestar()" }],
      },
    ),
    beat(
      "Recibir la respuesta",
      "La flecha punteada devuelve prestado. Sigue siendo el mismo ejemplar: cambió el estado, no la identidad.",
      "Si la respuesta fuera un new Ejemplar, el estante y el préstamo dejarían de hablar del mismo libro.",
      {
        kind: "sequence",
        lifelines: ["ana : Usuario", "E-204 : Ejemplar"],
        messages: [
          { from: 0, to: 1, label: "prestar()" },
          { from: 1, to: 0, label: "prestado", kind: "return" },
        ],
      },
    ),
    beat(
      "Cerrar el concepto",
      "Objeto, clase y mensaje ya se pueden distinguir en el préstamo. El laboratorio arma esa secuencia y comprueba que no nazca otro ejemplar.",
      "Dos variables pueden apuntar al mismo E-204. Lo que una cambia, la otra lo ve.",
      classFig("Ejemplar", ["codigo = E-204", "estado = prestado"], ["prestar()"]),
    ),
  ],
  2: [
    beat(
      "Nombrar las piezas",
      "Ejemplar declara atributos y métodos. El objeto e204 guarda los valores. El constructor deja el ejemplar disponible.",
      "La clase describe. El objeto recuerda. El método es lo que sabe hacer.",
      classFig("Ejemplar", ["- codigo", "- estado"], ["+ Ejemplar()", "+ prestar()"]),
    ),
    beat(
      "Ocultar el estado",
      "estado no es una variable global ni un campo público. Cada ejemplar tiene el suyo y solo prestar() lo cambia.",
      "Un segundo ejemplar no puede pisar el estado del primero.",
      classFig("Ejemplar", ["- estado"], ["+ prestar()", "+ devolver()"]),
    ),
    beat(
      "El mismo mensaje",
      "Libro y Revista reciben diasDePrestamo(). El mensaje es uno. La respuesta depende de la clase real del objeto.",
      "Polimorfismo no es copiar el método: es responder distinto al mismo llamado.",
      {
        kind: "gen",
        parent: { name: "Material", members: ["+ diasDePrestamo()"] },
        children: [
          { name: "Libro", members: ["+ diasDePrestamo() → 15"] },
          { name: "Revista", members: ["+ diasDePrestamo() → 7"] },
        ],
      },
    ),
    beat(
      "La técnica en el código",
      "En Java el campo es private. En Python el convenio es self._estado. El laboratorio rechaza la variable global.",
      "private en el método y public en el campo es el encapsulamiento al revés.",
      { kind: "code", text: "private String estado;\npublic void prestar() { }" },
    ),
  ],
  3: [
    beat(
      "Abrir el diagrama",
      "El modelador guarda la decisión, no solo el dibujo. El lienzo de esta semana se llama Prestamo y no intenta ser todo el sistema.",
      "Si disponible queda con signo más, el encapsulamiento todavía no está aplicado.",
      classFig("Ejemplar", ["- codigo", "- disponible"], ["+ prestar()", "+ devolver()"]),
    ),
    beat(
      "Fijar la multiplicidad",
      "Biblioteca 1 custodia * Ejemplar. El 1 y el asterisco dicen cuántos participan; la línea simple dice que se conocen.",
      "Sin números, el código no sabe si guarda un ejemplar o una lista.",
      {
        kind: "assoc",
        left: "Biblioteca",
        right: "Ejemplar",
        kindName: "asociación",
        label: "custodia",
        leftMult: "1",
        rightMult: "*",
      },
    ),
    beat(
      "Aplicar la generalización",
      "Libro y Revista son un Material. diasDePrestamo() baja como mensaje común y cada hijo responde con su plazo.",
      "Prestamo no entra en esa familia: no es un material.",
      {
        kind: "gen",
        parent: { name: "Material", members: ["- codigo", "+ diasDePrestamo()"] },
        children: [
          { name: "Libro", members: ["+ diasDePrestamo() → 15"] },
          { name: "Revista", members: ["+ diasDePrestamo() → 7"] },
        ],
      },
    ),
    beat(
      "Elegir el rombo",
      "El rombo lleno promete que la parte muere con el todo. Si el ejemplar sigue existiendo fuera de la biblioteca, la línea es asociación.",
      "La herencia se lee «es un». La asociación se lee «tiene» o «conoce».",
      {
        kind: "assoc",
        left: "Biblioteca",
        right: "Ejemplar",
        kindName: "composición",
        label: "contiene",
        leftMult: "1",
        rightMult: "*",
      },
    ),
  ],
  4: [
    beat(
      "Repartir el préstamo",
      "Biblioteca, Ejemplar, Prestamo y Usuario no son una sola clase. Cada una cambia por una razón distinta.",
      "Si el nombre necesita un «y», sobran responsabilidades.",
      classFig("Prestamo", ["- fechaSalida", "- fechaLimite"], ["+ estaVencido()"]),
    ),
    beat(
      "Leer la relación",
      "Biblioteca compone o custodia ejemplares. Prestamo se asocia con un ejemplar: el trámite no es el libro.",
      "Un botón de la pantalla no aparece en este diagrama.",
      {
        kind: "assoc",
        left: "Prestamo",
        right: "Ejemplar",
        kindName: "asociación",
        label: "sobre",
        leftMult: "*",
        rightMult: "1",
      },
    ),
    beat(
      "Subir lo común",
      "codigo y titulo viven en Material. Libro y Revista no los copian. Lo que cambia, el plazo, se redefine abajo.",
      "Dos clases con los mismos campos todavía no son una familia.",
      {
        kind: "gen",
        parent: { name: "Material", members: ["- codigo", "- titulo"] },
        children: [
          { name: "Libro", members: ["+ diasDePrestamo()"] },
          { name: "Revista", members: ["+ diasDePrestamo()"] },
        ],
      },
    ),
    beat(
      "Bajar al código",
      "La composición de muchos ejemplares es una lista en Biblioteca. La herencia es extends en Java y la clase entre paréntesis en Python.",
      "El modelo manda. El código no inventa otra relación.",
      { kind: "code", text: "class Libro extends Material { }\nclass Libro(Material):" },
    ),
  ],
  5: [
    beat(
      "Leer los tres compartimentos",
      "Nombre, atributos y operaciones. - codigo: String oculta el dato. + prestar(): void publica el mensaje y declara el retorno.",
      "Un nombre suelto dentro de la caja obliga a adivinar el código.",
      classFig("Ejemplar", ["- codigo: String", "- disponible: boolean"], ["+ prestar(): void", "+ devolver(): void"]),
    ),
    beat(
      "Mover el estado",
      "disponible pasa a prestado con prestar(). enviarATaller() lo saca a en reparación. El objeto sigue siendo E-204.",
      "Cada flecha es un mensaje, no una asignación hecha desde fuera.",
      { kind: "pills", states: ["disponible", "prestado", "en reparación"], at: 1 },
    ),
    beat(
      "Lo común del paradigma",
      "Cualquier clase del préstamo responde por su estado, ofrece operaciones y no hace el trabajo de las demás.",
      "UML escribe el paradigma. No lo reemplaza.",
      classFig("Usuario", ["- codigo", "- nombre"], ["+ solicitar()"]),
    ),
    beat(
      "Pasar la caja al lenguaje",
      "Java escribe private String codigo y public void prestar(). Python anota codigo: str y el retorno None.",
      "El signo menos del diagrama y el private del código dicen lo mismo.",
      { kind: "code", text: "private String codigo;\npublic void prestar() { }" },
    ),
  ],
  6: [
    beat(
      "Poner al actor fuera",
      "Usuario quiere prestar y devolver. Esas metas quedan dentro del borde Biblioteca. Un botón no entra al óvalo.",
      "El caso de uso se nombra con un verbo de la persona, no con un control.",
      {
        kind: "usecase",
        actor: "Usuario",
        system: "Biblioteca",
        cases: ["Prestar ejemplar", "Devolver ejemplar"],
      },
    ),
    beat(
      "Marcar include y extend",
      "Prestar ejemplar incluye Validar usuario: siempre ocurre. Devolver ejemplar extiende Aplicar sanción solo si hay retraso.",
      "Include y extend son flechas punteadas. No son herencia.",
      {
        kind: "usecase",
        actor: "Usuario",
        system: "Biblioteca",
        cases: ["Prestar ejemplar"],
        relations: [{ from: "Prestar ejemplar", to: "Validar usuario", kind: "«include»" }],
      },
    ),
    beat(
      "Depender del contrato",
      "ServicioPrestamo llama a apartar en Catalogo. No recorre la lista de CatalogoEnMemoria ni la de CatalogoEnArchivo.",
      "La realización es línea punteada con triángulo vacío.",
      classFig("Catalogo", [], ["+ buscar(codigo)", "+ apartar(codigo, usuario)"], { stereotype: "«interfaz»" }),
    ),
    beat(
      "Implementar, no heredar",
      "Biblioteca implements Catalogo. extends Catalogo trata el contrato como un padre con estado y en Java no corresponde.",
      "El servicio conoce el contrato. La clase concreta puede cambiar mañana.",
      { kind: "code", text: "interface Catalogo { Ejemplar buscar(String codigo); }\nclass Biblioteca implements Catalogo { }" },
    ),
  ],
  7: [
    beat(
      "Marcar el molde",
      "Material va en cursiva y con «abstracta». Guarda titulo y deja prestar() sin cuerpo. No se construye.",
      "La cursiva no destaca importancia: prohíbe el new.",
      classFig("Material", ["- titulo"], ["+ prestar()"], { abstract: true, stereotype: "«abstracta»" }),
    ),
    beat(
      "Cerrar en el hijo",
      "Libro implementa prestar() y ya se puede construir. La variable puede ser Material; el objeto es Libro.",
      "Si el hijo no cierra el método, el hijo también es abstracto.",
      {
        kind: "gen",
        parent: { name: "Material", abstract: true, stereotype: "«abstracta»", members: ["+ prestar()"] },
        children: [
          { name: "Libro", members: ["+ prestar()"] },
          { name: "Revista", members: ["+ prestar()"] },
        ],
      },
    ),
    beat(
      "Separar los paquetes",
      "dominio reúne Material, Libro, Revista y Ejemplar. prestamo reúne Prestamo, Usuario y Catalogo. El modelador guarda esa frontera.",
      "StarUML registra el modelo. El dibujo suelto no alcanza como evidencia.",
      { kind: "code", text: "dominio: Material, Libro, Revista, Ejemplar\nprestamo: Prestamo, Usuario, Catalogo" },
    ),
    beat(
      "No confundir con la interfaz",
      "Material guarda estado. Catalogo solo promete operaciones. La abstracta y la interfaz responden preguntas distintas.",
      "new Material() no es una prueba. new Libro() sí.",
      { kind: "code", text: "Material libro = new Libro();\n// new Material() no compila" },
    ),
  ],
  8: [
    beat(
      "Validar primero",
      "prestar() pregunta si E-204 está disponible antes de tocar el estado. Usuario nulo, ejemplar prestado y fecha imposible son tres preguntas distintas.",
      "La guarda va antes de la asignación.",
      { kind: "pills", states: ["disponible", "¿válido?", "prestado"], at: 1 },
    ),
    beat(
      "No cambiar si falla",
      "Si el ejemplar ya está prestado, la excepción sale y estado sigue igual. Asignar y luego lanzar deja el objeto y el aviso en contradicción.",
      "Una operación que falla no cambia el objeto y además avisa.",
      { kind: "code", text: "if (!estado.equals(\"disponible\"))\n    throw new IllegalStateException(...);\nestado = \"prestado\";" },
    ),
    beat(
      "Avisar sin decidir la política",
      "Ejemplar detecta y avisa. No cobra la multa ni finge un éxito. Quien llama, más arriba, decide si reintenta o se lo dice a la persona.",
      "Un catch vacío compila y esconde el préstamo doble.",
      { kind: "pills", states: ["detectar", "no cambiar", "avisar", "decidir"], at: 2 },
    ),
    beat(
      "Depurar con un dato malo",
      "El recorrido se prueba con E-204 ya prestado o con un usuario nulo. Se mira la línea en la que el flujo se desvía y si el estado sobrevivió.",
      "Depurar no es un print al final: es seguir el proceso hasta el motivo.",
      { kind: "code", text: "except Exception:\n    pass   # el fallo desaparece" },
    ),
  ],
};

export function recorridoFor(week) {
  return [
    {
      type: "recorrido",
      id: "recorrido",
      title: "Recorrido del proceso",
      intro: "Reproducir mueve el proceso de esta semana. Cada parada muestra la figura y la regla técnica que el laboratorio va a pedir.",
      beats: weeks[week],
    },
  ];
}
