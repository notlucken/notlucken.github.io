---
layout: single
title: Dirty Pipe - CVE-2022-0847
excerpt: "Como escalar privilegios con la vulnerabilidad de Kernel Dirty Pipe."
date: 2022-10-28
classes: wide
header:
  teaser: /assets/images/dirtyP/logo.png
  teaser_home_page: true
categories:
  - Tecnicas
tags:
  - Escalada de Privilegios
  - Kernel
---

<p align="center">
<img src="/assets/images/dirtyP/logo.png" width="400">
</p>

# Dirty Pipe Vulnerability
Dirty Pipe <a href="https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2022-0847">(CVE-2022-0847)</a> es una vulnerabilidad en el Kernel de  Linux que permite a los usuarios no privilegiados modificar archivos de solo lectura y obtener una shell con privilegios.

## Versiones afectadas 
Las versiones de Kernel de Linux que son afectadas son las siguentes: 

*5.8 -> 5.16.10 
5.15.24 
5.10.101* 

## Links: 
* 1: <a href="https://dirtypipe.cm4all.com/">https://dirtypipe.cm4all.com/</a>  
* 2: <a href="https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2022-084">https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2022-0847</a>

## Como explotar un Dirty Pipe
Una vez ganamos acceso al sistema, y sin saber la contraseña, si ponemos el comando `uname -a` vemos que el Kernel es de version *>=5.16.9* -> version vulnerable.

![](/assets/images/dirtyP/2.png)

Podemos listar el `/etc/passwd`, pero no podemos modificarlo.
Para esto sirve el exploit, modificar archivos siendo usuarios sin privilegios.


![](/assets/images/dirtyP/3.png)


El exploit que esta en https://dirtypipe.cm4all.com/ podemos ponerlo en un `exploit.c` y compilarlo, para luego introducir lo que queremos hacer con el archivo a modificar.


![](/assets/images/dirtyP/4.png)


Que hicimos aqui: 
Modificamos el usuario *daemon*, y lo hicimos root

![](/assets/images/dirtyP/5.png)

Ahora, hay que obtener una shell como Root.

### Obtener una Shell como root despues de usar Dirty Pipe

Primero, hay que ver si hay algun SUID vulnerable para hacer escalada de privilegios.
Usamos el famoso comando: `find / -perm -4000 2>/dev/null`


![](/assets/images/dirtyP/6.png)


Vemos que `/usr/bin/sudo`  es un binario SUID con permisos de ejecucion. 

Para poder explotarlo, hay que usar otro binario llamado `dirtypipez.c`

### 3: Explotacion final: 
_https://raw.githubusercontent.com/febinrev/dirtypipez-exploit/main/dirtypipez.c_


![](/assets/images/dirtyP/7.png)


Luego de compilarlo, hay que correrlo como `./exploit2 /usr/bin/sudo` para ganar acceso a una Shell como root.

![](/assets/images/dirtyP/8.png)

