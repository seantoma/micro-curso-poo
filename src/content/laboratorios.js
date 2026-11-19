const flow = [
  "Validar los datos",
  "Detectar el estado inválido",
  "No cambiar el ejemplar",
  "Avisar el motivo",
  "Dejar que quien llama decida",
];

const labs = {
  1: {
    diagram: {
      id: "l1-d",
      title: "Arma el mensaje",
      prompt: "Elige quién envía, cuál es el mensaje y quién lo recibe. El estado no se reescribe desde fuera.",
      kind: "message",
      expect: { from: "Usuario", message: "prestar()", to: "Ejemplar" },
      options: {
        from: ["Usuario", "Ejemplar", "Programa"],
        message: ["prestar()", "estado = prestado", "new Ejemplar()"],
        to: ["Ejemplar", "Usuario", "Arreglo de títulos"],
      },
    },
    code: {
      id: "l1-c",
      title: "Escribe el cambio de estado",
      prompt: "Completa prestar para que el mismo ejemplar pase a prestado. No construyas otro objeto.",
      languages: {
        java: {
          starter: `class Ejemplar {\n    String codigo = "E-204";\n    String estado = "disponible";\n\n    void prestar() {\n    }\n}\n`,
          solution: `class Ejemplar {\n    String codigo = "E-204";\n    String estado = "disponible";\n\n    void prestar() {\n        estado = "prestado";\n    }\n}\n`,
          need: [
            { regex: "class\\s+Ejemplar", hint: "Declara la clase Ejemplar." },
            { regex: "void\\s+prestar\\s*\\(", hint: "El comportamiento va en un método prestar." },
            { regex: "estado\\s*=\\s*\"prestado\"", hint: "El mismo objeto cambia su estado a prestado." },
          ],
          forbid: [{ regex: "new\\s+Ejemplar", hint: "No crees otro ejemplar para cambiar el estado." }],
        },
        python: {
          starter: `class Ejemplar:\n    def __init__(self):\n        self.codigo = "E-204"\n        self.estado = "disponible"\n\n    def prestar(self):\n        pass\n`,
          solution: `class Ejemplar:\n    def __init__(self):\n        self.codigo = "E-204"\n        self.estado = "disponible"\n\n    def prestar(self):\n        self.estado = "prestado"\n`,
          need: [
            { regex: "class\\s+Ejemplar", hint: "Declara la clase Ejemplar." },
            { regex: "def\\s+prestar\\s*\\(", hint: "El comportamiento va en un método prestar." },
            { regex: "self\\.estado\\s*=\\s*\"prestado\"", hint: "El mismo objeto cambia su estado a prestado." },
          ],
          forbid: [{ regex: "Ejemplar\\s*\\(", hint: "No construyas otro ejemplar dentro del método." }],
        },
      },
    },
  },
  2: {
    diagram: {
      id: "l2-d",
      title: "Arma la caja de la clase",
      prompt: "Coloca el nombre, los atributos y los métodos. Un dato del catálogo no es un atributo del ejemplar.",
      kind: "classbox",
      expect: { name: "Ejemplar", attributes: ["codigo", "estado"], methods: ["prestar()", "devolver()"] },
      bank: ["Ejemplar", "codigo", "estado", "prestar()", "devolver()", "titulo del catálogo", "Biblioteca"],
    },
    code: {
      id: "l2-c",
      title: "Esconde el estado",
      prompt: "El estado solo cambia dentro de la clase. En Java márcalo privado y el método público. En Python usa el atributo interno y no una variable global.",
      languages: {
        java: {
          starter: `class Ejemplar {\n    String estado = "disponible";\n\n    void prestar() {\n        estado = "prestado";\n    }\n}\n`,
          solution: `class Ejemplar {\n    private String estado = "disponible";\n\n    public void prestar() {\n        estado = "prestado";\n    }\n}\n`,
          need: [
            { regex: "private\\s+String\\s+estado", hint: "El atributo estado queda privado." },
            { regex: "public\\s+void\\s+prestar", hint: "El método prestar queda público." },
          ],
          forbid: [],
        },
        python: {
          starter: `estado = "disponible"\n\ndef prestar():\n    global estado\n    estado = "prestado"\n`,
          solution: `class Ejemplar:\n    def __init__(self):\n        self._estado = "disponible"\n\n    def prestar(self):\n        self._estado = "prestado"\n`,
          need: [
            { regex: "class\\s+Ejemplar", hint: "El estado pertenece a la clase Ejemplar." },
            { regex: "self\\._estado", hint: "Guarda el estado en el objeto, no en una variable global." },
            { regex: "def\\s+prestar\\s*\\(", hint: "El cambio ocurre en el método prestar." },
          ],
          forbid: [{ regex: "global\\s+estado", hint: "Quita la variable global: el dato vive en el objeto." }],
        },
      },
    },
  },
  3: {
    diagram: {
      id: "l3-d",
      title: "Dibuja la asociación",
      prompt: "Una biblioteca conoce muchos ejemplares. Elige los extremos, el tipo de vínculo y la multiplicidad.",
      kind: "relation",
      expect: { left: "Biblioteca", right: "Ejemplar", kind: "asociación", leftMult: "1", rightMult: "*" },
      options: {
        left: ["Biblioteca", "Usuario", "Ejemplar"],
        right: ["Ejemplar", "Prestamo", "Material"],
        kind: ["asociación", "herencia", "dependencia"],
        leftMult: ["1", "*", "0..1"],
        rightMult: ["*", "1", "0..1"],
      },
    },
    code: {
      id: "l3-c",
      title: "Guarda la colección",
      prompt: "La clase Biblioteca debe recordar varios ejemplares, no uno solo escrito a mano.",
      languages: {
        java: {
          starter: `class Biblioteca {\n}\n`,
          solution: `import java.util.ArrayList;\nimport java.util.List;\n\nclass Biblioteca {\n    List<Ejemplar> ejemplares = new ArrayList<>();\n}\n`,
          need: [
            { regex: "class\\s+Biblioteca", hint: "Declara la clase Biblioteca." },
            { regex: "(List|ArrayList)<Ejemplar>", hint: "Usa una lista de Ejemplar para la asociación de muchos." },
          ],
          forbid: [],
        },
        python: {
          starter: `class Biblioteca:\n    def __init__(self):\n        pass\n`,
          solution: `class Biblioteca:\n    def __init__(self):\n        self.ejemplares = []\n`,
          need: [
            { regex: "class\\s+Biblioteca", hint: "Declara la clase Biblioteca." },
            { regex: "self\\.ejemplares\\s*=\\s*\\[", hint: "Inicializa la colección de ejemplares en el objeto." },
          ],
          forbid: [],
        },
      },
    },
  },
  4: {
    diagram: {
      id: "l4-d",
      title: "Arma la generalización",
      prompt: "Elige el padre y los hijos que de verdad son un material. Un préstamo no entra en esa familia. Esta semana no marques la clase como abstracta.",
      kind: "hierarchy",
      expect: { parent: "Material", abstract: false, children: ["Libro", "Revista"] },
      forbidChildren: ["Prestamo"],
      parents: ["Material", "Ejemplar", "Prestamo"],
      children: ["Libro", "Revista", "Prestamo", "Usuario"],
    },
    code: {
      id: "l4-c",
      title: "Declara que un libro es material",
      prompt: "Libro es un Material. Escríbelo como herencia, no como un atributo suelto.",
      languages: {
        java: {
          starter: `class Libro {\n    String titulo;\n}\n`,
          solution: `class Libro extends Material {\n    String titulo;\n}\n`,
          need: [{ regex: "class\\s+Libro\\s+extends\\s+Material", hint: "Libro extiende a Material." }],
          forbid: [],
        },
        python: {
          starter: `class Libro:\n    def __init__(self, titulo):\n        self.titulo = titulo\n`,
          solution: `class Libro(Material):\n    def __init__(self, titulo):\n        self.titulo = titulo\n`,
          need: [{ regex: "class\\s+Libro\\s*\\(\\s*Material\\s*\\)", hint: "Libro hereda de Material." }],
          forbid: [],
        },
      },
    },
  },
  5: {
    diagram: {
      id: "l5-d",
      title: "Arma la clase en notación UML",
      prompt: "Usa la visibilidad y el tipo. El atributo es privado y la operación es pública. No dejes el nombre pelado.",
      kind: "classbox",
      expect: { name: "Ejemplar", attributes: ["- codigo: String"], methods: ["+ prestar(): void"] },
      bank: ["Ejemplar", "Material", "- codigo: String", "codigo", "+ prestar(): void", "prestar", "- titulo: String"],
    },
    code: {
      id: "l5-c",
      title: "Pasa el diagrama al código",
      prompt: "En Java escribe el atributo privado y el método público. En Python anota el atributo como str y el retorno de prestar como None.",
      languages: {
        java: {
          starter: `class Ejemplar {\n    String codigo;\n\n    void prestar() {\n    }\n}\n`,
          solution: `class Ejemplar {\n    private String codigo;\n\n    public void prestar() {\n    }\n}\n`,
          need: [
            { regex: "private\\s+String\\s+codigo", hint: "codigo se declara private String." },
            { regex: "public\\s+void\\s+prestar", hint: "prestar se declara public void." },
          ],
          forbid: [],
        },
        python: {
          starter: `class Ejemplar:\n    def __init__(self):\n        self.codigo = ""\n\n    def prestar(self):\n        pass\n`,
          solution: `class Ejemplar:\n    codigo: str\n\n    def __init__(self):\n        self.codigo = ""\n\n    def prestar(self) -> None:\n        pass\n`,
          need: [
            { regex: "codigo:\\s*str", hint: "Anota codigo como str." },
            { regex: "def\\s+prestar\\(self\\)\\s*->\\s*None", hint: "Anota prestar con retorno None." },
          ],
          forbid: [],
        },
      },
    },
  },
  6: {
    diagram: {
      id: "l6-d",
      title: "Arma el caso de uso",
      prompt: "Coloca al actor, el nombre del sistema y las metas. Un botón no es un caso de uso.",
      kind: "usecase",
      expect: { actor: "Usuario", system: "Biblioteca", cases: ["Prestar ejemplar", "Devolver ejemplar"] },
      forbidCases: ["Botón prestar"],
      actors: ["Usuario", "Bibliotecario", "Botón prestar"],
      systems: ["Biblioteca", "Ejemplar", "Pantalla"],
      cases: ["Prestar ejemplar", "Devolver ejemplar", "Botón prestar", "Guardar en una tabla"],
    },
    code: {
      id: "l6-c",
      title: "Escribe el contrato",
      prompt: "Catalogo promete buscar. Biblioteca cumple ese contrato. No conviertas el contrato en una clase padre.",
      languages: {
        java: {
          starter: `class Biblioteca {\n    Ejemplar buscar(String codigo) {\n        return null;\n    }\n}\n`,
          solution: `interface Catalogo {\n    Ejemplar buscar(String codigo);\n}\n\nclass Biblioteca implements Catalogo {\n    public Ejemplar buscar(String codigo) {\n        return null;\n    }\n}\n`,
          need: [
            { regex: "interface\\s+Catalogo", hint: "Declara la interfaz Catalogo." },
            { regex: "implements\\s+Catalogo", hint: "Biblioteca implementa Catalogo." },
            { regex: "buscar\\s*\\(", hint: "El contrato incluye buscar." },
          ],
          forbid: [{ regex: "extends\\s+Catalogo", hint: "Catalogo no se hereda: se implementa." }],
        },
        python: {
          starter: `class Biblioteca:\n    def buscar(self, codigo):\n        return None\n`,
          solution: `from abc import ABC, abstractmethod\n\nclass Catalogo(ABC):\n    @abstractmethod\n    def buscar(self, codigo):\n        pass\n\nclass Biblioteca(Catalogo):\n    def buscar(self, codigo):\n        return None\n`,
          need: [
            { regex: "class\\s+Catalogo", hint: "Declara el contrato Catalogo." },
            { regex: "abstractmethod", hint: "Marca buscar como operación del contrato." },
            { regex: "class\\s+Biblioteca", hint: "Biblioteca es la clase que cumple el contrato." },
          ],
          forbid: [],
        },
      },
    },
  },
  7: {
    diagram: {
      id: "l7-d",
      title: "Marca la clase abstracta",
      prompt: "Material reúne a libro y revista, y no se puede construir. El préstamo sigue fuera de la familia.",
      kind: "hierarchy",
      expect: { parent: "Material", abstract: true, children: ["Libro", "Revista"] },
      forbidChildren: ["Prestamo"],
      parents: ["Material", "Ejemplar", "Prestamo"],
      children: ["Libro", "Revista", "Prestamo", "Usuario"],
    },
    code: {
      id: "l7-c",
      title: "Impide construir el molde",
      prompt: "Material queda abstracta y no se instancia. El hijo concreto completa la familia.",
      languages: {
        java: {
          starter: `class Material {\n    String titulo;\n}\n\nclass Libro extends Material {\n}\n`,
          solution: `abstract class Material {\n    String titulo;\n    abstract void prestar();\n}\n\nclass Libro extends Material {\n    void prestar() {\n    }\n}\n`,
          need: [{ regex: "abstract\\s+class\\s+Material", hint: "Declara Material como clase abstracta." }],
          forbid: [{ regex: "new\\s+Material\\s*\\(", hint: "No construyas un Material." }],
        },
        python: {
          starter: `class Material:\n    def __init__(self, titulo):\n        self.titulo = titulo\n\nclass Libro(Material):\n    pass\n`,
          solution: `from abc import ABC, abstractmethod\n\nclass Material(ABC):\n    def __init__(self, titulo):\n        self.titulo = titulo\n\n    @abstractmethod\n    def prestar(self):\n        pass\n\nclass Libro(Material):\n    def prestar(self):\n        pass\n`,
          need: [
            { regex: "class\\s+Material\\s*\\(\\s*ABC\\s*\\)", hint: "Material hereda de ABC." },
            { regex: "abstractmethod", hint: "Deja prestar como método abstracto." },
          ],
          forbid: [],
        },
      },
    },
  },
  8: {
    diagram: {
      id: "l8-d",
      title: "Ordena el tratamiento",
      prompt: "Sube o baja cada paso hasta reconstruir el proceso. Si la validación falla, el ejemplar no cambia y el motivo se avisa.",
      kind: "flow",
      expect: flow,
      start: [flow[3], flow[0], flow[4], flow[1], flow[2]],
    },
    code: {
      id: "l8-c",
      title: "Valida antes de prestar",
      prompt: "Si el ejemplar no está disponible, lanza un error. No lo marques como disponible ni tragues la excepción.",
      languages: {
        java: {
          starter: `class Ejemplar {\n    String estado = "prestado";\n\n    void prestar() {\n        estado = "disponible";\n    }\n}\n`,
          solution: `class Ejemplar {\n    String estado = "prestado";\n\n    void prestar() {\n        if (!estado.equals("disponible")) {\n            throw new IllegalStateException("El ejemplar no está disponible");\n        }\n    }\n}\n`,
          need: [
            { regex: "\\bif\\b", hint: "Comprueba la condición con if." },
            { regex: "throw\\b", hint: "Lanza el error cuando el estado no sirve." },
          ],
          forbid: [
            { regex: "estado\\s*=\\s*\"disponible\"", hint: "No cambies el estado a disponible dentro de prestar." },
            { regex: "catch\\s*\\([^)]*\\)\\s*\\{\\s*\\}", hint: "No tragues la excepción." },
          ],
        },
        python: {
          starter: `class Ejemplar:\n    def __init__(self):\n        self.estado = "prestado"\n\n    def prestar(self):\n        self.estado = "disponible"\n`,
          solution: `class Ejemplar:\n    def __init__(self):\n        self.estado = "prestado"\n\n    def prestar(self):\n        if self.estado != "disponible":\n            raise ValueError("El ejemplar no está disponible")\n`,
          need: [
            { regex: "\\bif\\b", hint: "Comprueba la condición con if." },
            { regex: "\\braise\\b", hint: "Lanza el error cuando el estado no sirve." },
          ],
          forbid: [
            { regex: "self\\.estado\\s*=\\s*\"disponible\"", hint: "No cambies el estado a disponible dentro de prestar." },
            { regex: "except[\\s\\S]{0,80}pass", hint: "No tragues la excepción." },
          ],
        },
      },
    },
  },
};

export function labFor(week) {
  const lab = labs[week];
  const diagram = lab.diagram;
  const code = lab.code;
  return [
    { type: "section", id: "laboratorio", title: "Laboratorio" },
    {
      type: "paragraphs",
      paragraphs: [
        "El laboratorio de esta semana tiene dos retos. El primero arma un diagrama del tema. El segundo pide un fragmento corto en Java o en Python. Comprobar revisa la estructura: no ejecuta el programa ni sustituye una prueba con datos reales.",
      ],
    },
    {
      type: "diagramLab",
      ...diagram,
      solution: diagram.kind === "flow" ? { steps: diagram.expect } : diagram.expect,
    },
    { type: "codeLab", ...code },
  ];
}
