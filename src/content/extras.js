import { recorridoFor } from "./recorridos.js";

function sheet(week) {
  const file = `/plantillas/semana-0${week}.html`;
  return {
    type: "downloads",
    title: "Hoja de ruta y formato",
    items: [
      {
        href: file,
        name: `Semana ${week} · ruta, ejemplo y formato en blanco`,
        note: "Ábrela para seguir la ruta o descárgala y complétala. El ejemplo ya viene resuelto con el préstamo del ejemplar.",
      },
    ],
  };
}

export function extrasFor(week) {
  const blocks = EXTRAS[week] || [];
  if (!blocks.length) return [];
  return [blocks[0], ...recorridoFor(week), ...blocks.slice(1)];
}

const EXTRAS = {
  1: [
    { type: "section", id: "codigo", title: "Diagrama, código y formato" },
    {
      type: "diagram",
      kind: "message",
      title: "Un mensaje entre dos objetos",
      caption: "Ana no reescribe el estado de E-204. Le envía prestar(). La identidad del ejemplar no cambia.",
      from: { name: "ana", type: "Usuario" },
      message: "prestar()",
      to: { name: "E-204", type: "Ejemplar", state: "disponible → prestado" },
    },
    {
      type: "diagram",
      kind: "sequence",
      title: "Diagrama de secuencia del mismo mensaje",
      caption: "La línea de vida sigue siendo el mismo ejemplar. La flecha punteada es la respuesta, no un objeto nuevo.",
      lifelines: ["ana : Usuario", "E-204 : Ejemplar"],
      messages: [
        { from: 0, to: 1, label: "prestar()" },
        { from: 1, to: 0, label: "prestado", kind: "return" },
      ],
    },
    {
      type: "codePair",
      title: "El mismo objeto, antes y después del mensaje",
      caption: "codigo fija la identidad. estado cambia y el objeto sigue siendo el mismo.",
      java: `public class Ejemplar {
    private final String codigo;
    private String estado;

    public Ejemplar(String codigo) {
        this.codigo = codigo;
        this.estado = "disponible";
    }

    public void prestar() {
        this.estado = "prestado";
    }
}`,
      python: `class Ejemplar:
    def __init__(self, codigo: str) -> None:
        self.codigo = codigo
        self.estado = "disponible"

    def prestar(self) -> None:
        self.estado = "prestado"`,
    },
    {
      type: "codePick",
      id: "s1-pick",
      title: "¿Cuál conserva la identidad?",
      prompt: "E-204 pasa de disponible a prestado. ¿Qué fragmento es programación orientada a objetos?",
      options: [
        {
          id: "nuevo",
          label: "Crear otro ejemplar con el mismo código",
          code: `prestado = new Ejemplar("E-204");
prestado.estado = "prestado";`,
          ok: false,
          why: "Aparece un objeto nuevo. El ejemplar disponible sigue existiendo al lado. Cambió la identidad, no el estado.",
        },
        {
          id: "mismo",
          label: "Enviar prestar() al ejemplar que ya existe",
          code: `ejemplar = new Ejemplar("E-204");
ejemplar.prestar();`,
          ok: true,
          why: "Es el mismo objeto. El mensaje cambia su estado y el código E-204 sigue identificándolo.",
        },
      ],
    },
    sheet(1),
  ],
  2: [
    { type: "section", id: "codigo", title: "Diagrama, código y formato" },
    {
      type: "diagram",
      kind: "hierarchy",
      title: "Herencia: Material, Libro y Revista",
      caption: "Lo común sube a Material. diasDePrestamo() baja con una respuesta distinta en cada hija.",
      parent: { name: "Material", members: ["- codigo", "+ prestar()", "+ diasDePrestamo()"] },
      children: [
        { name: "Libro", members: ["diasDePrestamo() → 15"] },
        { name: "Revista", members: ["diasDePrestamo() → 7"] },
      ],
    },
    {
      type: "diagram",
      kind: "objects",
      title: "Diagrama de objetos",
      caption: "La clase es el molde. El diagrama de objetos muestra dos instancias concretas y el vínculo entre ellas.",
      link: "solicita",
      objects: [
        { name: "ana", type: "Usuario", slots: ["nombre = Ana"] },
        { name: "e204", type: "Ejemplar", slots: ["codigo = E-204", "estado = disponible"] },
      ],
    },
    {
      type: "codePair",
      title: "Elementos: clase, atributo, constructor y método",
      caption: "En Java el atributo es private. En Python el guion bajo avisa que el dato no se usa desde fuera.",
      java: `public class Ejemplar {
    private boolean disponible;

    public Ejemplar() {
        this.disponible = true;
    }

    public void prestar() {
        if (!disponible) {
            throw new IllegalStateException("ocupado");
        }
        disponible = false;
    }
}`,
      python: `class Ejemplar:
    def __init__(self) -> None:
        self._disponible = True

    def prestar(self) -> None:
        if not self._disponible:
            raise ValueError("ocupado")
        self._disponible = False`,
    },
    {
      type: "codePair",
      title: "Polimorfismo: el mismo mensaje, otra respuesta",
      caption: "Quien llama usa dias_de_prestamo() sin preguntar si el objeto es libro o revista.",
      java: `Libro libro = new Libro("E-204");
Revista revista = new Revista("R-12");

int diasLibro = libro.diasDePrestamo();
int diasRevista = revista.diasDePrestamo();`,
      python: `libro = Libro("E-204")
revista = Revista("R-12")

dias_libro = libro.dias_de_prestamo()
dias_revista = revista.dias_de_prestamo()`,
    },
    {
      type: "codePick",
      id: "s2-pick",
      title: "¿Dónde está el encapsulamiento?",
      prompt: "Hay que impedir que la pantalla marque el ejemplar como libre sin pasar por la regla.",
      options: [
        {
          id: "publico",
          label: "Atributo público",
          code: `ejemplar.disponible = true;`,
          ok: false,
          why: "Cualquiera pisa el estado. No hay método que pueda rechazar el cambio.",
        },
        {
          id: "metodo",
          label: "Método que custodia el dato",
          code: `ejemplar.prestar();`,
          ok: true,
          why: "El dato queda oculto. Solo prestar() decide si el cambio es válido.",
        },
      ],
    },
    sheet(2),
  ],
  3: [
    { type: "section", id: "codigo", title: "Diagrama, código y formato" },
    {
      type: "diagram",
      kind: "hierarchy",
      title: "Lo que debe quedar en la herramienta",
      caption: "Disponible va con signo menos. prestar() y devolver() con signo más. La generalización sale de Libro y Revista hacia Material.",
      parent: { name: "Material", members: ["- codigo", "- disponible", "+ prestar()", "+ devolver()"] },
      children: [
        { name: "Libro", members: ["+ diasDePrestamo()"] },
        { name: "Revista", members: ["+ diasDePrestamo()"] },
      ],
    },
    {
      type: "diagram",
      kind: "association",
      title: "Asociación con multiplicidad",
      caption: "Una biblioteca custodia muchos ejemplares. El rombo lleno indica composición: el ejemplar catalogado no vive fuera de esa biblioteca.",
      edge: "composición",
      label: "custodia",
      leftMult: "1",
      rightMult: "*",
      left: { name: "Biblioteca", members: ["- nombre", "+ recibir(ejemplar)"] },
      right: { name: "Ejemplar", members: ["- codigo", "+ prestar()"] },
    },
    {
      type: "codePair",
      title: "La técnica aplicada, no solo dibujada",
      caption: "El diagrama y el código dicen lo mismo: la hija responde el mensaje que la padre anuncia.",
      java: `public class Material {
    private boolean disponible = true;

    public void prestar() {
        if (!disponible) {
            throw new IllegalStateException("ocupado");
        }
        disponible = false;
    }

    public int diasDePrestamo() {
        return 0;
    }
}

public class Libro extends Material {
    @Override
    public int diasDePrestamo() {
        return 15;
    }
}`,
      python: `class Material:
    def __init__(self) -> None:
        self._disponible = True

    def prestar(self) -> None:
        if not self._disponible:
            raise ValueError("ocupado")
        self._disponible = False

    def dias_de_prestamo(self) -> int:
        return 0

class Libro(Material):
    def dias_de_prestamo(self) -> int:
        return 15`,
    },
    {
      type: "codePick",
      id: "s3-pick",
      title: "¿Qué código corresponde al diagrama?",
      prompt: "En el modelador, disponible es privado y prestar() es público.",
      options: [
        {
          id: "abierto",
          label: "El dato se asigna desde fuera",
          code: `ejemplar.disponible = false;`,
          ok: false,
          why: "Eso sería un atributo público. El diagrama lo marcó con signo menos.",
        },
        {
          id: "cerrado",
          label: "El cambio entra por el método público",
          code: `ejemplar.prestar();`,
          ok: true,
          why: "Coincide con el modelo: el dato está oculto y la operación es el mensaje visible.",
        },
      ],
    },
    sheet(3),
  ],
  4: [
    { type: "section", id: "codigo", title: "Diagrama, código y formato" },
    {
      type: "diagram",
      kind: "links",
      title: "Cuatro clases y sus relaciones",
      caption: "Prestamo conoce a un usuario y a un ejemplar. Si el préstamo se anula, los otros dos siguen existiendo: es asociación.",
      boxes: [
        { name: "Usuario", detail: "1" },
        { name: "Prestamo", detail: "*" },
        { name: "Ejemplar", detail: "1" },
      ],
      note: "Usuario 1 —— * Prestamo * —— 1 Ejemplar",
    },
    {
      type: "diagram",
      kind: "association",
      title: "Composición frente a asociación",
      caption: "Biblioteca compone ejemplares. Prestamo solo se asocia: si el préstamo se borra, el ejemplar sigue en el estante.",
      edge: "asociación",
      label: "sobre",
      leftMult: "*",
      rightMult: "1",
      left: { name: "Prestamo", members: ["- fechaSalida", "+ estaVencido()"] },
      right: { name: "Ejemplar", members: ["- codigo", "+ devolver()"] },
    },
    {
      type: "codePair",
      title: "La asociación, escrita como referencias",
      caption: "Un préstamo no hereda de usuario ni de ejemplar. Los guarda para colaborar.",
      java: `public class Prestamo {
    private final Usuario usuario;
    private final Ejemplar ejemplar;

    public Prestamo(Usuario usuario, Ejemplar ejemplar) {
        this.usuario = usuario;
        this.ejemplar = ejemplar;
        ejemplar.prestar();
    }
}`,
      python: `class Prestamo:
    def __init__(self, usuario: Usuario, ejemplar: Ejemplar) -> None:
        self._usuario = usuario
        self._ejemplar = ejemplar
        ejemplar.prestar()`,
    },
    {
      type: "codePick",
      id: "s4-pick",
      title: "¿Qué relación está escrita?",
      prompt: "Prestamo recibe un Usuario y un Ejemplar ya creados y los recuerda.",
      options: [
        {
          id: "herencia",
          label: "Herencia",
          code: `class Prestamo extends Usuario { }`,
          ok: false,
          why: "Un préstamo no es un usuario. Extender Usuario mezclaría responsabilidades.",
        },
        {
          id: "asociacion",
          label: "Asociación",
          code: `prestamo = Prestamo(usuario, ejemplar)`,
          ok: true,
          why: "Las tres instancias existen por su cuenta y el préstamo las conoce. Eso es asociación.",
        },
      ],
    },
    sheet(4),
  ],
  5: [
    { type: "section", id: "codigo", title: "Diagrama, código y formato" },
    {
      type: "diagram",
      kind: "uml",
      title: "Una clase leída en UML",
      caption: "Tres compartimentos. El signo menos oculta el estado. El signo más publica el mensaje. Eso se repite en todas las clases del paradigma.",
      className: "Ejemplar",
      attributes: ["- codigo: String", "- disponible: boolean"],
      methods: ["+ prestar()", "+ devolver()", "+ diasDePrestamo(): int"],
    },
    {
      type: "diagram",
      kind: "state",
      title: "Diagrama de estados del ejemplar",
      caption: "UML también describe cómo cambia un objeto. Cada flecha es un mensaje que dispara la transición.",
      states: ["disponible", "prestado", "en reparación"],
      transitions: ["prestar()", "enviarATaller()", ""],
    },
    {
      type: "codePair",
      title: "Del compartimento UML al código",
      caption: "Lo privado no sale de la clase. Lo público es lo que otra clase puede pedir.",
      java: `public class Ejemplar {
    private String codigo;
    private boolean disponible;

    public void prestar() { }
    public void devolver() { }
    public int diasDePrestamo() { return 15; }
}`,
      python: `class Ejemplar:
    def __init__(self) -> None:
        self._codigo = ""
        self._disponible = True

    def prestar(self) -> None:
        pass

    def devolver(self) -> None:
        pass

    def dias_de_prestamo(self) -> int:
        return 15`,
    },
    {
      type: "codePick",
      id: "s5-pick",
      title: "Qué es común a todo el paradigma",
      prompt: "Ejemplar, Prestamo y Usuario guardan datos privados y ofrecen métodos públicos.",
      options: [
        {
          id: "notacion",
          label: "Solo una costumbre de nombres",
          code: `codigo = "E-204"  // variable suelta del programa`,
          ok: false,
          why: "Una variable suelta no pertenece a ninguna clase. No hay responsabilidad ni ocultamiento.",
        },
        {
          id: "paradigma",
          label: "Ocultamiento y responsabilidad en cada clase",
          code: `ejemplar.prestar();
prestamo.estaVencido();`,
          ok: true,
          why: "Cada clase responde por lo suyo y el estado se toca con un mensaje. Eso es común al paradigma, y UML lo escribe con + y -.",
        },
      ],
    },
    sheet(5),
  ],
  6: [
    { type: "section", id: "codigo", title: "Diagrama, código y formato" },
    {
      type: "diagram",
      kind: "interface",
      title: "La aplicación depende del contrato",
      caption: "ServicioPrestamo conoce Catalogo. No conoce la lista ni el archivo. Las dos clases concretas cumplen el mismo contrato.",
      client: "ServicioPrestamo",
      contract: "Catalogo",
      implementations: ["CatalogoEnMemoria", "CatalogoEnArchivo"],
    },
    {
      type: "codePair",
      title: "Interfaz en Java y contrato en Python",
      caption: "Java usa interface. Python usa una clase abstracta como contrato. El servicio recibe el contrato, no la lista.",
      java: `public interface Catalogo {
    Ejemplar buscar(String codigo);
    void apartar(String codigo, Usuario usuario);
}

public class ServicioPrestamo {
    private final Catalogo catalogo;

    public ServicioPrestamo(Catalogo catalogo) {
        this.catalogo = catalogo;
    }

    public void prestar(String codigo, Usuario usuario) {
        catalogo.apartar(codigo, usuario);
    }
}`,
      python: `from abc import ABC, abstractmethod

class Catalogo(ABC):
    @abstractmethod
    def buscar(self, codigo: str):
        pass

    @abstractmethod
    def apartar(self, codigo: str, usuario: str) -> None:
        pass

class ServicioPrestamo:
    def __init__(self, catalogo: Catalogo) -> None:
        self._catalogo = catalogo

    def prestar(self, codigo: str, usuario: str) -> None:
        self._catalogo.apartar(codigo, usuario)`,
    },
    {
      type: "codePick",
      id: "s6-pick",
      title: "Uso correcto de la interfaz",
      prompt: "Mañana el catálogo puede dejar la lista y pasar a un archivo.",
      options: [
        {
          id: "lista",
          label: "El servicio recorre la lista interna",
          code: `for (Ejemplar e : memoria.getLista()) {
    e.prestar();
}`,
          ok: false,
          why: "getLista() ata el servicio a CatalogoEnMemoria. El archivo no tiene esa lista.",
        },
        {
          id: "contrato",
          label: "El servicio llama al contrato",
          code: `catalogo.apartar(codigo, usuario);`,
          ok: true,
          why: "apartar() existe en las dos implementaciones. El servicio no se entera de cuál llegó.",
        },
      ],
    },
    sheet(6),
  ],
  7: [
    { type: "section", id: "codigo", title: "Diagrama, código y formato" },
    {
      type: "diagram",
      kind: "hierarchy",
      title: "Material en cursiva: no se instancia",
      caption: "En StarUML el nombre abstracto va en cursiva. Libro y Revista sí pueden crearse, y tienen que escribir diasDePrestamo().",
      parent: { name: "Material", abstract: true, members: ["- codigo", "+ prestar()", "+ diasDePrestamo() {abstract}"] },
      children: [
        { name: "Libro", members: ["+ diasDePrestamo() → 15"] },
        { name: "Revista", members: ["+ diasDePrestamo() → 7"] },
      ],
    },
    {
      type: "diagram",
      kind: "packages",
      title: "Diagrama de paquetes",
      caption: "La herramienta CASE agrupa el modelo. El paquete no es una clase: es el lugar donde viven las clases relacionadas.",
      packages: [
        { name: "dominio", classes: ["Material", "Libro", "Revista", "Ejemplar"] },
        { name: "prestamo", classes: ["Prestamo", "Usuario", "Catalogo"] },
      ],
    },
    {
      type: "codePair",
      title: "Clase abstracta con un método común y otro obligatorio",
      caption: "prestar() ya tiene cuerpo. diasDePrestamo() no. new Material() no es válido en ninguno de los dos lenguajes.",
      java: `public abstract class Material {
    private boolean disponible = true;

    public void prestar() {
        if (!disponible) {
            throw new IllegalStateException("ocupado");
        }
        disponible = false;
    }

    public abstract int diasDePrestamo();
}

public class Libro extends Material {
    @Override
    public int diasDePrestamo() {
        return 15;
    }
}`,
      python: `from abc import ABC, abstractmethod

class Material(ABC):
    def __init__(self) -> None:
        self._disponible = True

    def prestar(self) -> None:
        if not self._disponible:
            raise ValueError("ocupado")
        self._disponible = False

    @abstractmethod
    def dias_de_prestamo(self) -> int:
        pass

class Libro(Material):
    def dias_de_prestamo(self) -> int:
        return 15`,
    },
    {
      type: "codePick",
      id: "s7-pick",
      title: "¿Qué creación es válida?",
      prompt: "Material es abstracta. Libro ya implementó diasDePrestamo().",
      options: [
        {
          id: "hija",
          label: "Crear un libro",
          code: `Material libro = new Libro("E-204");
int dias = libro.diasDePrestamo();`,
          ok: true,
          why: "El objeto nace como Libro. La variable puede ser del tipo Material porque un libro es un material.",
        },
        {
          id: "padre",
          label: "Crear un material suelto",
          code: `Material suelto = new Material();`,
          ok: false,
          why: "La clase abstracta no se instancia. No existe un material que no sea libro, revista u otra hija concreta.",
        },
      ],
    },
    sheet(7),
  ],
  8: [
    { type: "section", id: "codigo", title: "Diagrama, código y formato" },
    {
      type: "diagram",
      kind: "flow",
      title: "Proceso cuando prestar falla",
      caption: "Validar es el primer paso y se queda en el código. El rombo pregunta si el estado es válido. Depurar es recorrer este proceso cuando el fallo igual ocurrió.",
      guard: "¿estado válido?",
      steps: ["Validar", "No cambiar estado", "Avisar", "Decidir arriba", "Cerrar"],
    },
    {
      type: "diagram",
      kind: "state",
      title: "Estado cuando la validación falla",
      caption: "Si prestar() no puede cumplirse, el ejemplar no entra a prestado. El estado inválido se avisa y se queda donde estaba.",
      states: ["prestado", "intento rechazado", "sigue prestado"],
      transitions: ["prestar() otra vez", "se conserva", ""],
    },
    {
      type: "codePair",
      title: "Validación y excepción",
      caption: "Si la regla falla, el estado no cambia y el motivo sale de la clase. Quien llamó decide qué decirle a la persona.",
      java: `public class ErrorValidacion extends Exception {
    public ErrorValidacion(String mensaje) {
        super(mensaje);
    }
}

public void prestar(Usuario usuario) throws ErrorValidacion {
    if (usuario == null) {
        throw new ErrorValidacion("falta el usuario");
    }
    if (!disponible) {
        throw new ErrorValidacion("ejemplar ocupado");
    }
    disponible = false;
    this.usuario = usuario;
}`,
      python: `class ErrorValidacion(Exception):
    pass

def prestar(self, usuario) -> None:
    if usuario is None:
        raise ErrorValidacion("falta el usuario")
    if not self._disponible:
        raise ErrorValidacion("ejemplar ocupado")
    self._disponible = False
    self._usuario = usuario`,
    },
    {
      type: "codePair",
      title: "Quien llama captura y decide",
      caption: "Tragar el error y seguir como si el préstamo existiera rompe el proceso.",
      java: `try {
    ejemplar.prestar(usuario);
} catch (ErrorValidacion error) {
    mostrar(error.getMessage());
}`,
      python: `try:
    ejemplar.prestar(usuario)
except ErrorValidacion as error:
    mostrar(str(error))`,
    },
    {
      type: "codePick",
      id: "s8-pick",
      title: "¿Qué tratamiento está completo?",
      prompt: "prestar() detectó que el usuario llega nulo.",
      options: [
        {
          id: "traga",
          label: "Capturar y no decir nada",
          code: `try {
    ejemplar.prestar(usuario);
} catch (ErrorValidacion error) {
}`,
          ok: false,
          why: "El programa no se cae, pero nadie se entera y parece que el préstamo siguió.",
        },
        {
          id: "avisa",
          label: "Capturar y mostrar el motivo",
          code: `try {
    ejemplar.prestar(usuario);
} catch (ErrorValidacion error) {
    mostrar(error.getMessage());
}`,
          ok: true,
          why: "El estado no cambió dentro de prestar() y quien llama informa. Detectar, no cambiar, avisar y decidir quedan cubiertos.",
        },
      ],
    },
    sheet(8),
  ],
};
