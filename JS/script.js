
(() => {
  "use strict";

  const root = document.documentElement;

  // ==========================================
  // CONFIGURAÇÕES GERAIS
  // ==========================================

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function getCSS(variable) {
    return getComputedStyle(root)
      .getPropertyValue(variable)
      .trim();
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[char]);
  }

  // ==========================================
  // TEMA CLARO / ESCURO
  // ==========================================

  const themeButton = document.getElementById("theme");
  const themeKey = "kauan-theme";

  function getCurrentTheme() {
    return root.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark");
  }

  try {
    const savedTheme = localStorage.getItem(themeKey);

    if (savedTheme === "dark" || savedTheme === "light") {
      root.setAttribute("data-theme", savedTheme);
    }
  } catch (error) {
    console.warn("Não foi possível recuperar o tema salvo.");
  }

  if (themeButton) {
    themeButton.addEventListener("click", () => {
      const newTheme =
        getCurrentTheme() === "dark" ? "light" : "dark";

      root.setAttribute("data-theme", newTheme);

      try {
        localStorage.setItem(themeKey, newTheme);
      } catch (error) {
        console.warn("Não foi possível salvar o tema.");
      }
    });
  }

  // ==========================================
  // MATRIX RAIN
  // ==========================================

  const canvas = document.getElementById("rain");

  if (canvas && !reducedMotion) {
    const ctx = canvas.getContext("2d");

    if (ctx) {
      const fontSize = 16;
      const characters =
        "01アイウエオカキクケコサシスセソタチツテトナニヌネノ{}[]<>/;=+*#$%";

      let columns = 0;
      let drops = [];
      let lastFrame = 0;

      function resizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;

        canvas.style.width = window.innerWidth + "px";
        canvas.style.height = window.innerHeight + "px";

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        columns = Math.ceil(window.innerWidth / fontSize);

        drops = Array.from(
          { length: columns },
          () => Math.random() * -50
        );
      }

      function draw(timestamp) {
        requestAnimationFrame(draw);

        if (document.hidden || timestamp - lastFrame < 55) {
          return;
        }

        lastFrame = timestamp;

        const fade = getCSS("--fade") || "2,10,4";
        const rain = getCSS("--rain") || "0,255,102";

        ctx.fillStyle = `rgba(${fade}, 0.10)`;
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        ctx.fillStyle = `rgb(${rain})`;
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < columns; i++) {
          const character = characters[
            Math.floor(Math.random() * characters.length)
          ];

          ctx.fillText(
            character,
            i * fontSize,
            drops[i] * fontSize
          );

          if (
            drops[i] * fontSize > window.innerHeight &&
            Math.random() > 0.975
          ) {
            drops[i] = 0;
          }

          drops[i]++;
        }
      }

      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      requestAnimationFrame(draw);
    }
  }

  // ==========================================
  // TEXTO DIGITANDO
  // ==========================================

  const typedElement = document.getElementById("typed");

  if (typedElement) {
    const roles = [
      "Desenvolvedor Full Stack",
      "Estudante de Cibersegurança",
      "Linux • Kali Linux • Python",
      "Código limpo, sistemas seguros"
    ];

    let roleIndex = 0;
    let characterIndex = 0;
    let deleting = false;

    function typeEffect() {
      const currentText = roles[roleIndex];

      typedElement.textContent =
        currentText.substring(0, characterIndex);

      if (!deleting && characterIndex === currentText.length) {
        deleting = true;
        setTimeout(typeEffect, 1700);
        return;
      }

      if (deleting && characterIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }

      characterIndex += deleting ? -1 : 1;

      setTimeout(typeEffect, deleting ? 35 : 70);
    }

    if (reducedMotion) {
      typedElement.textContent = roles[0];
    } else {
      typeEffect();
    }
  }

  // ==========================================
  // SKILLS
  // ==========================================

  const skills = [
    ["HTML", "Estrutura semântica e acessível", "Avançado"],
    ["CSS", "Layouts responsivos e animações", "Avançado"],
    ["JavaScript", "Lógica e interatividade na web", "Intermediário"],
    ["Node.js", "APIs e servidores", "Intermediário"],
    ["Python", "Automação, scripts e análise de dados", "Avançado"],
    ["C", "Ponteiros, memória e algoritmos", "Intermediário"],
    ["Linux", "Terminal, usuários, arquivos e acesso remoto", "Avançado"],
    ["Kali Linux", "Ambiente de testes e ferramentas de segurança", "Intermediário"],
    ["Cibersegurança", "Fundamentos, redes e hacking ético", "Intermediário"]
  ];

  const skillsGrid = document.getElementById("skills-grid");

  if (skillsGrid) {
    skillsGrid.innerHTML = "";

    skills.forEach(([name, description, level]) => {
      const card = document.createElement("article");

      card.className = "card skill";

      const levelValue = {
        "Iniciante": 35,
        "Básico": 45,
        "Intermediário": 65,
        "Avançado": 85
      }[level] || 50;

      card.innerHTML = `
        <h3>
          ${escapeHTML(name)}
          <small class="lvl">${escapeHTML(level)}</small>
        </h3>

        <p>${escapeHTML(description)}</p>

        <div class="meter">
          <span style="width: ${levelValue}%"></span>
        </div>
      `;

      skillsGrid.appendChild(card);
    });
  }

  // ==========================================
  // CERTIFICADOS
  // ==========================================

  const certificates = [
    {
      nome: "Introdução à Cibersegurança",
      inst: "Cisco Networking Academy",
      ano: "2026"
    },
    {
      nome: "Introdução ao Hacking Ético e Testes de Penetração",
      inst: "Cisco Networking Academy",
      ano: "2026",
      tipo: "emblema"
    },
    {
      nome: "Princípios da Cibersegurança",
      inst: "DIO",
      ano: "2026"
    },
    {
      nome: "O Essencial Sobre Linux e Máquinas Virtuais",
      inst: "DIO",
      ano: "2026"
    },
    {
      nome: "Aprenda a Programar do Zero com JavaScript",
      inst: "DIO",
      ano: "2026"
    },
    {
      nome: "JavaScript para Web: HTML, CSS e APIs na Prática",
      inst: "DIO",
      ano: "2026"
    },
    {
      nome: "Crie um Site Simples usando HTML, CSS e JavaScript",
      inst: "Fundação Bradesco",
      ano: "2026"
    },
    {
      nome: "Fundamentos Node.js",
      inst: "DIO",
      ano: "2026"
    },
    {
      nome: "Fundamentos Essenciais de Python para Análise de Dados",
      inst: "DIO",
      ano: "2026"
    },
    {
      nome: "Introdução à Programação Orientada a Objetos com Python",
      inst: "DIO",
      ano: "2026"
    }
  ];

  const certificatesGrid = document.getElementById("certs");

  if (certificatesGrid) {
    certificatesGrid.innerHTML = "";

    certificates.forEach(certificate => {
      const card = document.createElement("article");

      card.className = "card cert";

      const badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = "✔ " + (certificate.tipo || "certificado");

      const title = document.createElement("h3");
      title.textContent = certificate.nome;

      const meta = document.createElement("span");
      meta.className = "meta";
      meta.textContent = `${certificate.inst} · ${certificate.ano}`;

      card.append(badge, title, meta);

      if (
        certificate.link &&
        /^https?:\/\//i.test(certificate.link)
      ) {
        const actions = document.createElement("div");
        actions.className = "actions";

        const link = document.createElement("a");
        link.href = certificate.link;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "> ver";

        actions.appendChild(link);
        card.appendChild(actions);
      }

      certificatesGrid.appendChild(card);
    });
  }

  // ==========================================
  // ANIMAÇÕES DE ENTRADA
  // ==========================================

  if (!reducedMotion && "IntersectionObserver" in window) {
    const animationStyle = document.createElement("style");

    animationStyle.textContent = `
      .reveal {
        opacity: 0;
        transform: translateY(25px);
        transition:
          opacity .7s ease,
          transform .7s ease;
      }

      .reveal.visible {
        opacity: 1;
        transform: translateY(0);
      }

      @media (prefers-reduced-motion: reduce) {
        .reveal {
          opacity: 1;
          transform: none;
          transition: none;
        }
      }
    `;

    document.head.appendChild(animationStyle);

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12
      }
    );

    document.querySelectorAll(
      "main section, main section .card, .hero .term"
    ).forEach(element => {
      element.classList.add("reveal");
      observer.observe(element);
    });
  }

  // ==========================================
  // MENU ATIVO DURANTE A NAVEGAÇÃO
  // ==========================================

  const navigationLinks = document.querySelectorAll("nav li a");

  if ("IntersectionObserver" in window) {
    const sections = document.querySelectorAll("main section[id]");

    const menuObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          navigationLinks.forEach(link => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === "#" + entry.target.id
            );
          });
        });
      },
      {
        rootMargin: "-45% 0px -50% 0px"
      }
    );

    sections.forEach(section => {
      menuObserver.observe(section);
    });
  }

  // ==========================================
  // ANO AUTOMÁTICO NO RODAPÉ
  // ==========================================

  const yearElement = document.getElementById("yr");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

})();
