---
slug: dev/using-databases
---

# Using Databases

When you are storing larger amounts of data inside a plugin, we recommend using a database. This guide will walk you through the startup process.

## MySQL vs SQLite

There are two main types of database software that you could use: MySQL vs SQLite. They both have many pros and cons outlined [here](TODO)
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
TODO
```

:::info

The JDBC Driver is bundled with Paper, so you do not need to shade/relocate it.

:::

From here, you must invoke a `Class.forName` on the driver to allow it to initialise and then create the connection to the database:

```java
public class DatabaseManager {
    
    public void connect() {
        Class.forName("org.sqlite.JDBC");
        Connection connection = DriverManager.getConnection("jdbc:sqlite:plugins/TestPlugin/database.db");
    }
}
```

This connection can be used to execute SQL operations on the database. Now, you can execute any operations you would like such as:
```sql
CREATE TABLE IF NOT EXISTS Bosses (id INTEGER PRIMARY KEY AUTOINCREMENT, uuid TEXT);
```
By just calling:
```java
connection.createStatement().execute(sqlString);
```

TODO: Add an example of reading / saving a basic DAO? 

To learn more about the Java Database Connection, see [here](TODO)

## MySQL

Working with MySQL requires a few more steps, however it can offer performance benefits for larger databases with 
many tables and concurrent accesses. We will be focussing on the [Hikari](TODO) library for this tutorial. First, add the
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