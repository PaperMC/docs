---
title: Using databases
description: Databases are the recommended way to store a large amount of data. This guide outlines a few key details.
slug: paper/dev/using-databases
---

When you are storing larger amounts of data inside a plugin, we recommend using a database. This guide will walk you through the startup process.

## What is a database?

A database is a collection of information that is stored electronically on a computer system. There are many different types of databases,
and the main two categories are SQL and NoSQL.

### NoSQL vs SQL

A NoSQL (Not Only SQL) database is a type of database management system that differs from the traditional relational database model.
Unlike traditional SQL databases, which store data in structured tables with predefined schemas, NoSQL databases are schema-less
and offer flexible data models.

They are designed to handle large volumes of unstructured or semi-structured data.
NoSQL databases use various data models, such as key-value, document, column-family, or graph, depending on
the specific requirements of the application.

On the other hand, an SQL database is a type of database management system that follows the relational database model.
It organizes data into structured tables with predefined schemas, where each table represents an entity and columns
represent attributes of that entity. SQL (Structured Query Language) is used to interact with the database,
allowing users to perform various operations like querying, inserting, updating, and deleting data.

## File-based vs standalone databases

When working with databases, you have two options: file-based or standalone. File-based databases are stored in a file on the disk,
and are usually used for smaller databases. Standalone databases operate in a separate process, and are usually used for larger data models.

### File-based databases

File-based databases are all stored within a single file on the disk. They are usually used for smaller databases, as they are easier to set up and use.
They can be created and handled from within your plugin code, but offer lesser performance than standalone databases.
Some examples of file-based databases are `SQLite` and `H2`.

<details>
  <summary>Simple SQLite Setup</summary>

#### SQLite

To work with SQLite, you will need a driver to connect / initialize the database.

:::note

The JDBC Driver is bundled with Paper, so you do not need to shade/relocate it in your plugin.

:::

##### Usage

You must invoke a [`Class#forName(String)`](jd:java:java.lang.Class#forName(java.lang.String))
on the driver to allow it to initialize and then create the connection to the database:

```java title="DatabaseManager.java"
public class DatabaseManager {

  public void connect() {
    Class.forName("org.sqlite.JDBC");
    Connection connection = DriverManager.getConnection("jdbc:sqlite:plugins/TestPlugin/database.db");
  }
}
```

You then have access to a [`Connection`](jd:java:java.sql:java.sql.Connection) object,
which you can use to create a [`Statement`](jd:java:java.sql:java.sql.Statement) and execute SQL queries.
To learn more about the Java Database Connectivity API, see [here](https://www.baeldung.com/java-jdbc)

</details>

### Standalone databases

As previously mentioned, standalone databases operate in a separate process. They are harder to set up and use,
but offer better performance than file-based databases. Some examples of standalone databases are `MySQL`, `MariaDB` and `PostgreSQL`.
There are many more, but these are some of the most popular ones. Each has their own advantages and disadvantages,
so it is up to you to decide which one to use.

The connectors for these databases often have connection pooling. Database connection pooling is where it creates
a pool of pre-established and reusable database connections. Instead of opening a new connection every time a
database operation is required, the application can request a connection from the pool, use it for the required task,
and then return it back to the pool for future reuse. This significantly reduces the overhead of creating and tearing
down connections repeatedly, leading to improved application performance and better scalability.

<details>
  <summary>Simple MySQL Setup</summary>

#### MySQL

Working with MySQL requires a few more steps, however it can offer performance benefits for larger databases with
many tables and concurrent accesses. This is a short setup guide for using the [Hikari](https://github.com/brettwooldridge/HikariCP) library with MySQL.

:::note

This will require a running MySQL database to connect to.

:::

First, add the dependency to your project with the following dependency:

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

The Hikari library is not bundled with Paper, so you will need to shade/relocate it. In Gradle, you will need to use the [Shadow plugin](https://gradleup.com/shadow/).
Alternatively, you can use the library loader with your Paper plugin to load the library at runtime. See [here](/paper/dev/getting-started/paper-plugins#loaders)
for more information on how to use this.

:::

##### Usage

Once you have the dependency added, we can work with the connector in our code:

```java title="DatabaseManager.java"
public class DatabaseManager {

  public void connect() {
    HikariConfig config = new HikariConfig();
    config.setJdbcUrl("jdbc:mysql://localhost:3306/mydatabase"); // Address of your running MySQL database
    config.setUsername("username"); // Username
    config.setPassword("password"); // Password
    config.setMaximumPoolSize(10); // Pool size defaults to 10

    config.addDataSourceProperty("", ""); // MISC settings to add
    HikariDataSource dataSource = new HikariDataSource(config);

    try (Connection connection = dataSource.getConnection()) {
      // Use a try-with-resources here to autoclose the connection.
      PreparedStatement sql = connection.prepareStatement("SQL");
      // Execute statement
    } catch (Exception e) {
      // Handle any exceptions that arise from getting / handing the exception.
    }
  }
}
```

</details>

## Security

### SQL Injection

SQL injection is a malicious technique where attackers exploit improper input validation to execute unauthorized SQL commands,
potentially causing data breaches or damage to the database.

For example, consider the following code:

```java
public void login(String username, String password) {
    String sql = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
    // Execute SQL
}
```

If the user enters the following as their username:

```
' OR 1=1; --
```

The SQL statement will become:

```sql
SELECT * FROM users WHERE username = '' OR 1=1; -- AND password = 'password'
```

This will return all users in the database, regardless of the password they entered. This is a simple example,
but it can be used to do much more malicious things, such as deleting the entire database or stealing user data.

### Prepared statements

Using prepared statements in Java with [`PreparedStatement`](jd:java:java.sql:java.sql.PreparedStatement)s
helps prevent SQL injection. They separate SQL code from user input by using placeholders, reducing the risk of executing unintended SQL commands.
**Always** use prepared statements to ensure the security and integrity of your data. Read more about SQL injection
[here](https://www.baeldung.com/sql-injection).
