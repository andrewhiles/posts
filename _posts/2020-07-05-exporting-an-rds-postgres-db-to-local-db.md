---
layout: post
title: Exporting an RDS Postgres database to local database
date: 2020-07-05
categories: [AWS, RDS, Postgres]
excerpt: 
---
If you work with databases in the cloud, there's a high possibility that you've worked with/or at least are familiar with Amazon's relational database service, [RDS](https://aws.amazon.com/rds/). RDS offers capabilities to host all of the major relational database engines you would need when considering database provisioning, hosting, scaling, etc. In my case, I use RDS almost every day and it's another AWS service that I think makes developers lives much more hassle-free. My database engine of choice is usually [Postgres](https://www.postgresql.org/) and that's going to be the engine I'll use for this blog post. However, in most cases, the steps listed below can be easily modified to suit the [other engines](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html#Welcome.Concepts.DBInstance) RDS supports.

In most cases there a projects where you need to seed a local database with data from a deployed database instance. This could be for testing purposes or debugging some kind of issue in your system. The intention of this blog post is to provide a few brief steps for how this can be achieved when using an RDS Postgres database and [pgAdmin](https://www.pgadmin.org/).

# Prerequisites
I am assuming you have Postgres and pgAdmin installed on your local machine and an RDS Postgres database hosted without any issues on AWS (running on default Postgres 5432 port).

# Configuring RDS Security Group
In order to connect to your RDS database instance, you will need to adjust the [Security Group](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithSecurityGroups.html) configuration on the database to allow for incoming connections from your local machine's IP address. In most cases, I'd advocate for doing this change via [Cloudformation](https://aws.amazon.com/cloudformation/) but for the purpose of this blog post and simplicity, you can alter Security Group configuration via the [AWS Console](https://aws.amazon.com/console/). To modify the Security Group in the AWS Console, locate your RDS database instance, find the Security Group associated to the instance and click 'Edit inbound rules'. Once inside the rules section, add a new inbound rule with type 'PostgresSQL', set protocol to 'TCP' with a port range of 5432. Select the Source option of 'My IP' and the AWS Console should automatically add your IP address to the rule. Now that you've added this rule, you should be able to connect from your local machine directly to the RDS database instance.

# Connecting using pgAdmin
Now that you have configured the Security Group ingress rules to allow connections from your local machine, you need to connect to the database. Using [pgAdmin](https://www.pgadmin.org/), create a new server with the database host URL and user credentials used to access the database.

# Using pg_dump module to create backup
Once you have successfully connected to the database, locate the database in the pgAdmin browser panel then right-click on the database name. Select the 'Backup' option. This will let you configure the backup task, selecting the dump file location, compression options, etc. Once you are happy with the configuration of the backup, click 'Backup'. pgAdmin will then run a [pg_dump](https://www.postgresql.org/docs/12/app-pgdump.html) command that should look something like the code below.

```
pg_dump --file "/pathToYourDumpFile.sql" --host "yourRDSInstance" --port "5432" --username "username"
```

# Loading backup into local database
Once you have successfully created your .sql dump file, create an empty local database using pgAdmin. Once created, select your local database instance in pgAdmin and right-click 'Restore', locate your dump file and click 'Restore' to run the job. Depending on how large the file is, this could take some time. Once the job completes, you will have a replica of an RDS database setup for local usage.

It's worth noting, this would be much easier to explain using commands via the terminal but it also requires setting up user configuration for when you want to connect to a Postgres database and this can be tricky. Using pgAdmin makes this aspect of creating a backup and restoring easier for the purposes of a blog post.

Hopefully this will be of use to someone else. Thanks.