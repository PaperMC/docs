---
slug: dev/using-databases
---

# Using Databases

When you are storing larger amounts of data inside a plugin, we recommend using a database. This guide will walk you through the startup process.

## MySQL vs SQLite

There are two main types of database software that you could use: MySQL vs SQLite. They both have many pros and cons outlined [here](https://www.hostinger.com/tutorials/sqlite-vs-mysql-whats-the-difference/)
in more depth, however the main difference is that MySQL requires external database software running, whereas SQLite is the entire package. Both are explained below.

## SQLite

To work with SQLite you will need a driver to connect / initialise the database. 
We will be recommending the JDBC connector which can be added to your project with the following dependency:

### Maven:
```xml
<dependency>
    <groupId>org.xerial</groupId>
    <artifactId>sqlite-jdbc</artifactId>
    <version>3.40.0.0</version>
    <scope>provided</scope>
</dependency>
```

### Kotlin Gradle:
```kotlin
dependencies {
    compileOnly("org.xerial:sqlite-jdbc:3.40.0.0")
}
```

:::info

The JDBC Driver is bundled with Paper, so you do not need to shade/relocate it.

:::

### Usage

From here, you must invoke a `Class.forName` on the driver to allow it to initialise and then create the connection to the database:

```java
public class DatabaseManager {
    
    public void connect() {
        Class.forName("org.sqlite.JDBC");
        Connection connection = DriverManager.getConnection("jdbc:sqlite:plugins/TestPlugin/database.db");
    }
}
```

To learn more about the Java Database Connection, see [here](https://www.w3schools.blog/jdbc-tutorial)

## MySQL

Working with MySQL requires a few more steps, however it can offer performance benefits for larger databases with 
many tables and concurrent accesses. We will be focussing on the [Hikari](https://github.com/brettwooldridge/HikariCP) library for this tutorial. First, add the
dependency to your project with the following dependency:

### Maven
```xml
<dependency>
    <groupId>com.zaxxer</groupId>
    <artifactId>HikariCP</artifactId>
    <version>4.0.3</version>
    <scope>compile</scope>
</dependency>
```

### Gradle
```kotlin
dependencies {
    implementation("com.zaxxer:HikariCP:4.0.3")
}
```

### Usage

Once you have the dependency added, we can work with the connector in our code:

```java
public class DatabaseManager {
    
    public void connect() {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc://mysql://localhost:3306/mydatabase"); // Address of your running MySQL database
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
