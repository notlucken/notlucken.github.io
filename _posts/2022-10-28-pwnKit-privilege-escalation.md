---
layout: single
title: PwnKit - Privilege Escalation
excerpt: "Explicacion de que es el PwnKit y como explotarlo."
date: 2022-10-27
classes: wide
header:
  teaser: /assets/images/pwnKit/logo.png
  teaser_home_page: true
categories:
  - Escalada de Privilegios
tags:
  - pkexec
  - SUID
---

<p align="center">
<img src="/assets/images/pwnKit/logo.png">
</p>

# PwnKit Vulnerability
PwnKit es una vulnerabilidad de correcion de memoria en pkexec de Polkit, que le permite a algun usuario sin privilegios convertirse en Root..
Polkit es el software que se encarga de controlar los privilegios de sistema en sistemas basados en Unix. Es un programa SUID instalado en todas las distribuiciones de Linux.

### Reconocimiento de un PwnKit

Las versiones de pkexec vulnerables a un PwnKit son todas desde *Mayo de 2009 -> Hasta el presente.*

La version de Kernel que tenemos ahora es *5.4.0-199-generic* y la distribucion es *Ubuntu 20.04 LTS.*

![](/assets/images/pwnKit/pwn2.png)

Si hacemos un ``find / -perm -4000 2>/dev/null`` sale que pkexec es un binario SUID.

![](/assets/images/pwnKit/pwn3.png)

Y la version del *pkexec* es la *0.105*.

![](/assets/images/pwnKit/pwn4.png)

En mi GitHub dejo los exploits que hay que utilizar.

<a href="https://github.com/notlucken/linux-privilege-escalation/tree/main/PwnKit">pwnKit Exploit</a>

Esta *MakeFile*, el *evil-so.c* y *exploit.c*

![](/assets/images/pwnKit/pwn6.png)

Hacemos un  ./MakeFile y nos dara algunos errores, pero no pasa nada.

y luego un **./exploit** y listo!

![](/assets/images/pwnKit/pwn7.png)

