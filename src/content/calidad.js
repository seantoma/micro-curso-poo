const repaso = {
  4: [
    {
      id: "r4-identidad",
      title: "Qué sigue siendo el mismo objeto",
      prompt: "E-204 pasa de disponible a prestado. ¿Qué se conserva?",
      options: [
        { id: "otro", label: "Nace otro ejemplar con el mismo título", ok: false, why: "Cambió el estado. La identidad del ejemplar sigue siendo E-204." },
        { id: "mismo", label: "Sigue siendo el ejemplar E-204", ok: true, why: "La identidad no se reemplaza cuando cambia el estado." },
        { id: "clase", label: "La clase Ejemplar desaparece del modelo", ok: false, why: "La clase es el molde. El cambio ocurre en el objeto." },
      ],
    },
    {
      id: "r4-ocultar",
      title: "Dónde vive el estado",
      prompt: "¿Quién puede escribir el estado de un ejemplar bien encapsulado?",
      options: [
        { id: "fuera", label: "Cualquier función del programa", ok: false, why: "Si cualquiera lo escribe, el dato no tiene dueño." },
        { id: "metodo", label: "El propio ejemplar, por un método", ok: true, why: "El estado se oculta y se cambia con un mensaje." },
        { id: "global", label: "Una variable global llamada estado", ok: false, why: "Una global no pertenece a ningún objeto." },
      ],
    },
    {
      id: "r4-herencia",
      title: "Qué significa la generalización",
      prompt: "Libro y Revista apuntan a Material. ¿Cómo se lee?",
      options: [
        { id: "tiene", label: "Material contiene una lista de libros", ok: false, why: "Eso sería asociación o composición, no generalización." },
        { id: "es", label: "Un libro es un material", ok: true, why: "La flecha de generalización se lee «es un»." },
        { id: "usa", label: "Libro usa a Material un momento y la olvida", ok: false, why: "Usar sin ser un tipo de la otra clase es dependencia." },
      ],
    },
  ],
  6: [
    {
      id: "r6-relacion",
      title: "Qué relación sobrevive",
      prompt: "Se borra un préstamo. El ejemplar sigue en el estante. ¿Qué relación había?",
      options: [
        { id: "comp", label: "Composición: la parte muere con el todo", ok: false, why: "Si el ejemplar sigue, no era una parte que viviera dentro del préstamo." },
        { id: "asoc", label: "Asociación: se conocen y cada uno puede seguir", ok: true, why: "El préstamo apunta al ejemplar. Borrar el préstamo no borra el ejemplar." },
        { id: "gen", label: "Generalización: Prestamo es un Ejemplar", ok: false, why: "Un préstamo no es un tipo de ejemplar." },
      ],
    },
    {
      id: "r6-uml",
      title: "Qué dice el signo menos",
      prompt: "En la clase UML, codigo va con signo menos. ¿Qué rasgo del paradigma escribe ese signo?",
      options: [
        { id: "herencia", label: "Que la clase hereda de otra", ok: false, why: "La herencia se dibuja con la flecha de triángulo vacío." },
        { id: "oculto", label: "Que el atributo está oculto", ok: true, why: "El signo menos es visibilidad privada: el estado no se toca desde fuera." },
        { id: "caso", label: "Que hay un caso de uso", ok: false, why: "El caso de uso es un óvalo fuera de la caja de la clase." },
      ],
    },
    {
      id: "r6-mensaje",
      title: "Qué es un mensaje",
      prompt: "Usuario necesita el ejemplar. ¿Cuál es el mensaje?",
      options: [
        { id: "asigna", label: "ejemplar.estado = prestado, escrito desde Usuario", ok: false, why: "Eso reescribe el dato ajeno. No es un mensaje." },
        { id: "pide", label: "ejemplar.prestar(), y el ejemplar decide", ok: true, why: "El mensaje pide un comportamiento. El estado lo cambia quien lo posee." },
        { id: "nuevo", label: "new Ejemplar() con el mismo código", ok: false, why: "Crear otro objeto cambia la identidad." },
      ],
    },
  ],
  8: [
    {
      id: "r8-contrato",
      title: "De quién depende el servicio",
      prompt: "ServicioPrestamo tiene que apartar un ejemplar. ¿A quién conoce?",
      options: [
        { id: "lista", label: "A la lista interna de CatalogoEnMemoria", ok: false, why: "Conocer la lista ata el servicio a una implementación." },
        { id: "contrato", label: "Al contrato Catalogo", ok: true, why: "La interfaz es el contrato. La clase concreta puede cambiar." },
        { id: "boton", label: "Al botón prestar de la pantalla", ok: false, why: "Un botón no es una clase del dominio ni un caso de uso." },
      ],
    },
    {
      id: "r8-abstracta",
      title: "Qué no se puede construir",
      prompt: "Material es abstracta y diasDePrestamo() no tiene cuerpo. ¿Qué creación es válida?",
      options: [
        { id: "molde", label: "new Material()", ok: false, why: "Una clase abstracta no se instancia." },
        { id: "libro", label: "new Libro(), porque Libro completa el método", ok: true, why: "Se crea el tipo concreto que sí puede cumplir el contrato del padre." },
        { id: "interfaz", label: "new Catalogo()", ok: false, why: "La interfaz tampoco se instancia: se implementa." },
      ],
    },
    {
      id: "r8-caso",
      title: "Qué entra en el caso de uso",
      prompt: "¿Cuál es un caso de uso del préstamo?",
      options: [
        { id: "boton", label: "Botón prestar", ok: false, why: "Es un control de pantalla, no una meta del actor." },
        { id: "meta", label: "Registrar préstamo", ok: true, why: "El caso nombra lo que el actor logra con el sistema." },
        { id: "tabla", label: "Guardar en una tabla", ok: false, why: "La tabla es una decisión de implementación." },
      ],
    },
  ],
};

function quizzes(items) {
  return items.map((item) => ({ type: "quiz", ...item }));
}

export function calidadFor(week) {
  const opening = repaso[week]
    ? [{ type: "section", id: "repaso", title: "Repaso" }, ...quizzes(repaso[week])]
    : [];
  const beforeLab = [];
  const closing = [];

  if (week === 2) {
    beforeLab.push(
      { type: "section", id: "transferencia", title: "Transferencia" },
      {
        type: "codePick",
        id: "t2-transfer",
        title: "La misma técnica, en una cuenta",
        prompt: "Una cuenta recuerda su saldo. El retiro no puede dejar el saldo en una variable suelta del programa. ¿Qué fragmento encapsula?",
        options: [
          {
            id: "global",
            label: "El saldo es de todo el programa",
            code: `saldo = 100\n\ndef retirar(monto):\n    global saldo\n    saldo = saldo - monto`,
            ok: false,
            why: "El saldo no tiene dueño. Cualquier función lo reescribe.",
          },
          {
            id: "objeto",
            label: "El saldo es del objeto cuenta",
            code: `class Cuenta:\n    def __init__(self):\n        self._saldo = 100\n\n    def retirar(self, monto):\n        self._saldo = self._saldo - monto`,
            ok: true,
            why: "Es el mismo ocultamiento del ejemplar: el dato vive en el objeto y cambia por un método.",
          },
        ],
      },
    );
  }

  if (week === 4) {
    beforeLab.push(
      { type: "section", id: "revision", title: "Revisión de un diseño" },
      {
        type: "quiz",
        id: "c4-revision",
        title: "Una clase que hace de todo",
        prompt: "La clase Biblioteca guarda nombre del lector, fecha de salida, título del libro y además presta. ¿Qué decisión de modelado corresponde?",
        code: `class Biblioteca {\n    String lector;\n    String fechaSalida;\n    String titulo;\n    void prestar() { fechaSalida = hoy; }\n}`,
        options: [
          { id: "dejar", label: "Dejarla así: una clase basta para la aplicación", ok: false, why: "Una sola clase se queda con tres responsabilidades. El préstamo, el ejemplar y la persona usuaria dejan de existir." },
          { id: "partir", label: "Partir lector, ejemplar y préstamo en clases distintas", ok: true, why: "Cada clase responde por lo suyo. Biblioteca puede conocerlas; no tiene que ser ellas." },
          { id: "heredar", label: "Hacer que Biblioteca herede de String", ok: false, why: "Heredar de un tipo de dato no reparte responsabilidades." },
        ],
      },
      { type: "section", id: "transferencia", title: "Transferencia" },
      {
        type: "quiz",
        id: "t4-transfer",
        title: "La misma relación, en un pedido",
        prompt: "Un pedido tiene líneas. Si se anula el pedido, las líneas se eliminan con él. ¿Qué relación es?",
        options: [
          { id: "asoc", label: "Asociación: las líneas siguen en otro pedido", ok: false, why: "Si mueren con el pedido, no son objetos que vivan por su cuenta." },
          { id: "comp", label: "Composición: la línea es parte del pedido", ok: true, why: "Es la misma lectura que un ejemplar que solo existe dentro de su biblioteca." },
          { id: "gen", label: "Generalización: Linea es un Pedido", ok: false, why: "Una línea no es un tipo de pedido." },
        ],
      },
    );
  }

  if (week === 6) {
    beforeLab.push(
      { type: "section", id: "revision", title: "Revisión de un diseño" },
      {
        type: "quiz",
        id: "c6-revision",
        title: "El servicio abre la lista ajena",
        prompt: "ServicioPrestamo recibe CatalogoEnMemoria y recorre su lista para marcar prestado, sin llamar a apartar(). ¿Qué se rompe?",
        code: `for (Ejemplar ejemplar : memoria.getLista()) {\n    ejemplar.estado = "prestado";\n}`,
        options: [
          { id: "pantalla", label: "Falta un botón en el caso de uso", ok: false, why: "El fallo está en el diseño interno, no en el actor." },
          { id: "contrato", label: "El servicio depende de la implementación y reescribe el estado", ok: true, why: "El contrato era apartar(). Recorrer la lista y asignar el estado salta la interfaz y el ocultamiento." },
          { id: "herencia", label: "Falta que ServicioPrestamo herede de Ejemplar", ok: false, why: "El servicio no es un ejemplar. Tiene que usar el contrato." },
        ],
      },
      { type: "section", id: "transferencia", title: "Transferencia" },
      {
        type: "quiz",
        id: "t6-transfer",
        title: "El mismo contrato, en un cobro",
        prompt: "Un cobro puede salir por un banco o por una pasarela. El servicio de ventas no debería conocer cuál. ¿Qué introduce el diseño?",
        options: [
          { id: "concreta", label: "Que Ventas llame a BancoLocal.debitar()", ok: false, why: "Mañana la pasarela cambia y Ventas tiene que reescribirse." },
          { id: "contrato", label: "Una interfaz MedioDeCobro con debitar(), implementada por cada medio", ok: true, why: "Es el mismo uso de Catalogo: el cliente conoce el contrato, no la clase concreta." },
          { id: "caso", label: "Un caso de uso llamado Tabla de pagos", ok: false, why: "El caso de uso nombra la meta de quien paga, no la tabla." },
        ],
      },
    );
  }

  if (week === 8) {
    beforeLab.push(
      { type: "section", id: "trazado", title: "Trazado" },
      {
        type: "quiz",
        id: "s8-traza",
        title: "Predice el estado línea por línea",
        prompt: "E-204 entra a prestar() con estado prestado. ¿Qué queda verdad al terminar el if?",
        code: `void prestar() {\n    if (!estado.equals("disponible")) { // estado vale "prestado"\n        throw new IllegalStateException("no disponible");\n    }\n    estado = "prestado";\n}`,
        options: [
          { id: "linea5", label: "La línea del final lo deja prestado otra vez, sin avisar", ok: false, why: "El throw corta el método. La asignación de abajo no se ejecuta." },
          { id: "sigue", label: "Sigue prestado, el error se lanza y la asignación no corre", ok: true, why: "La validación detecta el estado inválido, no lo cambia y avisa." },
          { id: "libre", label: "Pasa a disponible para poder prestarse", ok: false, why: "Ponerlo disponible sería un parche, no un tratamiento." },
        ],
      },
    );
    closing.push(
      { type: "section", id: "dossier", title: "Producto integrador" },
      {
        type: "dossier",
        id: "s8-dossier",
        title: "Dossier del préstamo",
        prompt: "Cierra el curso con un párrafo propio. No hace falta entregar un archivo: el texto queda en este navegador y se revisa con los cuatro criterios.",
        criteria: [
          "El modelo distingue asociación y composición en el préstamo.",
          "El caso de uso nombra actor y meta, no un botón.",
          "El código oculta el estado y valida antes de cambiarlo.",
          "El párrafo explica esas decisiones con el ejemplar E-204.",
        ],
      },
    );
  }

  return { opening, beforeLab, closing };
}
