---
title: Uso de bases de datos
description: Las bases de datos son la forma recomendada de almacenar grandes cantidades de datos. Esta guía explica algunos aspectos clave.
slug: es/paper/dev/using-databases
---

Cuando almacenes grandes cantidades de datos en un plugin, recomendamos usar una base de datos. Esta guía te explicará cómo empezar.

## ¿Qué es una base de datos?

Una base de datos es un conjunto de información almacenada electrónicamente en un sistema informático. Hay muchos tipos diferentes de bases de datos,
y las dos categorías principales son SQL y NoSQL.

### NoSQL y SQL

Una base de datos NoSQL (Not Only SQL) es un tipo de sistema de gestión de bases de datos diferente del modelo relacional tradicional.
A diferencia de las bases de datos SQL tradicionales, que almacenan los datos en tablas estructuradas con esquemas predefinidos, las bases de datos
NoSQL no tienen esquemas fijos y ofrecen modelos de datos flexibles.

Están diseñadas para gestionar grandes volúmenes de datos no estructurados o semiestructurados.
Las bases de datos NoSQL usan distintos modelos de datos, como clave-valor, documentos, familias de columnas o grafos, según
los requisitos concretos de la aplicación.

Por otro lado, una base de datos SQL es un tipo de sistema de gestión de bases de datos que sigue el modelo relacional.
Organiza los datos en tablas estructuradas con esquemas predefinidos, donde cada tabla representa una entidad y las columnas
representan sus atributos. SQL (Structured Query Language) se usa para interactuar con la base de datos y realizar operaciones
como consultar, insertar, actualizar y eliminar datos.

## Bases de datos en archivos y bases de datos independientes

Al trabajar con bases de datos, tienes dos opciones: en archivos o independientes. Las bases de datos en archivos se almacenan en un archivo del disco
y suelen usarse para bases de datos pequeñas. Las bases de datos independientes se ejecutan en un proceso aparte y suelen usarse para modelos de datos más grandes.

### Bases de datos en archivos

Las bases de datos en archivos se almacenan en un único archivo del disco. Suelen usarse para bases de datos pequeñas, ya que son más fáciles de configurar y usar.
Se pueden crear y gestionar desde el código del plugin, pero ofrecen menos rendimiento que las bases de datos independientes.
Algunos ejemplos son `SQLite` y `H2`.

<details>
  <summary>Configuración sencilla de SQLite</summary>

#### SQLite

Para usar SQLite, necesitas un driver para conectarte a la base de datos e inicializarla.

:::note

Paper incluye el driver JDBC, así que no es necesario sombrearlo ni reubicarlo en tu plugin.

:::

##### Uso

Debes invocar [](jd:java:java.lang.Class#forName(java.lang.String))
en el driver para que se inicialice y, después, crear la conexión a la base de datos:

```java title="DatabaseManager.java"
public class DatabaseManager {

    public void connect() {
        Class.forName("org.sqlite.JDBC");
        Connection connection = DriverManager.getConnection("jdbc:sqlite:plugins/ExamplePlugin/database.db");
    }
}
```

Entonces tendrás acceso a un objeto [](jd:java:java.sql:java.sql.Connection),
que puedes usar para crear un [](jd:java:java.sql:java.sql.Statement) y ejecutar consultas SQL.
Para obtener más información sobre la API Java Database Connectivity, consulta [aquí](https://www.baeldung.com/java-jdbc).

</details>

### Bases de datos independientes

Como ya se ha mencionado, las bases de datos independientes se ejecutan en un proceso aparte. Son más difíciles de configurar y usar,
pero ofrecen mejor rendimiento que las bases de datos en archivos. Algunos ejemplos son `MySQL`, `MariaDB` y `PostgreSQL`.
Hay muchas más, pero estas son algunas de las más populares. Cada una tiene sus propias ventajas e inconvenientes,
así que te corresponde decidir cuál usar.

Los conectores de estas bases de datos suelen incluir un pool de conexiones. Un pool de conexiones a una base de datos crea
un conjunto de conexiones preestablecidas y reutilizables. En lugar de abrir una conexión nueva cada vez que se necesita
una operación con la base de datos, la aplicación puede solicitar una conexión del pool, usarla para la tarea necesaria
y devolverla al pool para reutilizarla más adelante. Esto reduce considerablemente el coste de crear y cerrar conexiones repetidamente,
lo que mejora el rendimiento de la aplicación y su capacidad de ampliación.

<details>
  <summary>Configuración sencilla de MySQL</summary>

#### MySQL

Trabajar con MySQL requiere algunos pasos más, pero puede ofrecer ventajas de rendimiento en bases de datos grandes con
muchas tablas y accesos simultáneos. Esta es una guía breve para usar la biblioteca [Hikari](https://github.com/brettwooldridge/HikariCP) con MySQL.

:::note

Para seguir esta guía, debes tener una base de datos MySQL en ejecución a la que conectarte.

:::

Primero, añade esta dependencia al proyecto:

##### Maven
```xml title="pom.xml"
<dependency>
  <groupId>com.zaxxer</groupId>
  <artifactId>HikariCP</artifactId>
  <version>4.0.3</version>
  <scope>compile</scope>
</dependency>
```

##### Gradle
```kotlin title="build.gradle(.kts)"
dependencies {
  implementation("com.zaxxer:HikariCP:4.0.3")
}
```

:::caution

Paper no incluye la biblioteca Hikari, así que debes sombrearla o reubicarla. En Gradle, tendrás que usar el [plugin Shadow](https://gradleup.com/shadow/).
Como alternativa, puedes usar el loader de bibliotecas de tu plugin de Paper para cargarla durante la ejecución. Consulta [aquí](/es/paper/dev/getting-started/paper-plugins#loaders)
para obtener más información.

:::

##### Uso

Una vez añadida la dependencia, puedes usar el conector en el código:

```java title="DatabaseManager.java"
public class DatabaseManager {

    public void connect() {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:mysql://localhost:3306/mydatabase"); // Dirección de tu base de datos MySQL en ejecución
        config.setUsername("username"); // Username
        config.setPassword("password"); // Password
        config.setMaximumPoolSize(10); // Pool size defaults to 10

        config.addDataSourceProperty("", ""); // MISC settings to add
        HikariDataSource dataSource = new HikariDataSource(config);

        try (Connection connection = dataSource.getConnection()) {
            // Usa try-with-resources para cerrar la conexión automáticamente.
            PreparedStatement sql = connection.prepareStatement("SQL");
            // Ejecuta la instrucción.
        } catch (Exception e) {
            // Controla las excepciones que puedan surgir al obtener o procesar la excepción.
        }
    }
}
```

</details>

## Seguridad

### Inyección SQL

La inyección SQL es una técnica maliciosa en la que los atacantes aprovechan una validación incorrecta de la entrada para ejecutar comandos SQL no autorizados,
lo que puede provocar filtraciones de datos o daños en la base de datos.

Por ejemplo, considera el siguiente código:

```java
public void login(String username, String password) {
    String sql = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
    // Ejecuta SQL.
}
```

Si el usuario introduce lo siguiente como nombre de usuario:

```
' OR 1=1; --
```

La instrucción SQL quedará así:

```sql
SELECT * FROM users WHERE username = '' OR 1=1; -- AND password = 'password'
```

Esto devolverá todos los usuarios de la base de datos, independientemente de la contraseña que hayan introducido. Es un ejemplo sencillo,
pero se puede usar para causar daños mucho mayores, como eliminar toda la base de datos o robar datos de usuarios.

### Instrucciones preparadas

El uso de instrucciones preparadas en Java con [](jd:java:java.sql:java.sql.PreparedStatement)s
ayuda a evitar la inyección SQL. Separan el código SQL de la entrada del usuario mediante marcadores de posición y reducen el riesgo de ejecutar comandos SQL no deseados.
Usa **siempre** instrucciones preparadas para garantizar la seguridad e integridad de tus datos. Obtén más información sobre la inyección SQL
[aquí](https://www.baeldung.com/sql-injection).

Al usar `PreparedStatement`, el método `login` quedaría así:

```java
public void login(DataSource dataSource, String username, String password) {
    try (Connection connection = dataSource.getConnection()) {
        PreparedStatement statement = connection.prepareStatement("SELECT * FROM users WHERE username = ? AND password = ?");
        statement.setString(1, username);
        statement.setString(2, password);
        ResultSet result = statement.executeQuery();
        // Realiza el trabajo.
    } catch (Exception e) {
        // Controla las excepciones que puedan surgir al obtener o procesar la excepción.
    }
}
```

## Herramientas para bases de datos

Dada la complejidad de trabajar con bases de datos (gestionar conexiones, crear y proteger consultas o simplemente analizar los datos), existen
varias herramientas del ecosistema Java que facilitan estas tareas.

Algunos desarrolladores de plugins usan herramientas ligeras como [JDBI](https://jdbi.org/), [JOOQ](https://www.jooq.org/doc/latest/manual/)
o [Exposed](https://www.jetbrains.com/help/exposed/get-started-with-exposed.html), que se encargan de gran parte del trabajo
y permiten que los desarrolladores se centren en sus plugins en lugar de en la base de datos.
