const fs = require('fs');
const path = require('path');
const latex = require('node-latex');

// LaTeX generation middleware using node-latex
const generateResumeMiddleware = (req, res, next) => {
    try {
        const userData = req.body || {
            name: "Jake Ryan",
            phone: "123-456-7890",
            email: "jake@su.edu",
            linkedin: "https://linkedin.com/in/jake",
            github: "https://github.com/jake",
            education: [
              {
                university: "Southwestern University",
                location: "Georgetown, TX",
                degree: "Bachelor of Arts in Computer Science, Minor in Business",
                date: "Aug. 2018 -- May 2021"
              },
              {
                university: "Blinn College",
                location: "Bryan, TX",
                degree: "Associate's in Liberal Arts",
                date: "Aug. 2014 -- May 2018"
              }
            ],
            experience: [
              {
                title: "Undergraduate Research Assistant",
                company: "Texas AM University",
                date: "June 2020 -- Present",
                location: "College Station, TX",
                responsibilities: [
                  "Developed a REST API using FastAPI and PostgreSQL to store data from learning management systems",
                  "Developed a full-stack web application using Flask, React, PostgreSQL and Docker to analyze GitHub data",
                  "Explored ways to visualize GitHub collaboration in a classroom setting"
                ]
              },
              {
                title: "Information Technology Support Specialist",
                company: "Southwestern University",
                date: "Sep. 2018 -- Present",
                location: "Georgetown, TX",
                responsibilities: [
                  "Communicate with managers to set up campus computers used on campus",
                  "Assess and troubleshoot computer problems brought by students, faculty and staff",
                  "Maintain upkeep of computers, classroom equipment, and 200 printers across campus"
                ]
              },
              {
                title: "Artificial Intelligence Research Assistant",
                company: "Southwestern University",
                date: "May 2019 -- July 2019",
                location: "Georgetown, TX",
                responsibilities: [
                  "Explored methods to generate video game dungeons based off of The Legend of Zelda",
                  "Developed a game in Java to test the generated dungeons",
                  "Contributed 50K+ lines of code to an established codebase via Git",
                  "Conducted a human subject study to determine which video game dungeon generation technique is enjoyable",
                  "Wrote an 8-page paper and gave multiple presentations on-campus",
                  "Presented virtually to the World Conference on Computational Intelligence"
                ]
              }
            ],
            projects: [
              {
                title: "Gitlytics",
                tech: "Python, Flask, React, PostgreSQL, Docker",
                date: "June 2020 -- Present",
                details: [
                  "Developed a full-stack web application using Flask serving a REST API with React as the frontend",
                  "Implemented GitHub OAuth to get data from user’s repositories",
                  "Visualized GitHub data to show collaboration",
                  "Used Celery and Redis for asynchronous tasks"
                ]
              },
              {
                title: "Simple Paintball",
                tech: "Spigot API, Java, Maven, TravisCI, Git",
                date: "May 2018 -- May 2020",
                details: [
                  "Developed a Minecraft server plugin to entertain kids during free time for a previous job",
                  "Published plugin to websites gaining 2K+ downloads and an average 4.5/5-star review",
                  "Implemented continuous delivery using TravisCI to build the plugin upon new a release",
                  "Collaborated with Minecraft server administrators to suggest features and get feedback about the plugin"
                ]
              }
            ],
            skills: {
              languages: "Java, Python, C/C++, SQL (Postgres), JavaScript, HTML/CSS, R",
              frameworks: "React, Node.js, Flask, JUnit, WordPress, Material-UI, FastAPI",
              tools: "Git, Docker, TravisCI, Google Cloud Platform, VS Code, Visual Studio, PyCharm, IntelliJ, Eclipse",
              libraries: "pandas, NumPy, Matplotlib"
            }
          };


const latexTemplate = `
\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

%----------FONT OPTIONS----------
% sans-serif
% \\usepackage[sfdefault]{FiraSans}
% \\usepackage[sfdefault]{roboto}
% \\usepackage[sfdefault]{noto-sans}
% \\usepackage[default]{sourcesanspro}

% serif
% \\usepackage{CormorantGaramond}
% \\usepackage{charter}

\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Ensure that generate pdf is machine readable/ATS parsable
\\pdfgentounicode=1

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubSubheading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textit{\\small#1} & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape ${userData.name}} \\\\ \\vspace{1pt}
    \\small ${userData.phone} $|$ \\href{mailto:${userData.email}}{\\underline{${userData.email}}} $|$ 
    \\href{${userData.linkedin}}{\\underline{LinkedIn}} $|$
    \\href{${userData.github}}{\\underline{GitHub}}
\\end{center}

%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
    ${userData.education.map(edu => `
    \\resumeSubheading
      {${edu.university}}{${edu.location}}
      {${edu.degree}}{${edu.date}}
    `).join('')}
  \\resumeSubHeadingListEnd

%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart
    ${userData.experience.map(exp => `
    \\resumeSubheading
      {${exp.title}}{${exp.company}}
      {${exp.date}}{${exp.location}}
      \\resumeItemListStart
        ${exp.responsibilities.map(res => `\\resumeItem{${res}}`).join('')}
      \\resumeItemListEnd
    `).join('')}
  \\resumeSubHeadingListEnd

%-----------PROJECTS-----------
\\section{Projects}
  \\resumeSubHeadingListStart
    ${userData.projects.map(proj => `
    \\resumeProjectHeading
      {\\textbf{${proj.title}} $|$ \\emph{${proj.tech}}}{${proj.date}}
      \\resumeItemListStart
        ${proj.details.map(detail => `\\resumeItem{${detail}}`).join('')}
      \\resumeItemListEnd
    `).join('')}
  \\resumeSubHeadingListEnd

%-----------TECHNICAL SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Languages}{: ${userData.skills.languages}} \\\\
     \\textbf{Frameworks}{: ${userData.skills.frameworks}} \\\\
     \\textbf{Developer Tools}{: ${userData.skills.tools}} \\\\
     \\textbf{Libraries}{: ${userData.skills.libraries}}
    }}
 \\end{itemize}

%-------------------------------------------
\\end{document}
`;



        // Save LaTeX template to a file
        console.log(req.user);
        const latexFilePath = path.join(__dirname, '../resumes', `${req.user.id}.tex`);
        fs.writeFileSync(latexFilePath, latexTemplate);

        // Compile LaTeX to PDF using node-latex
        const input = fs.createReadStream(latexFilePath);
        const outputFilePath = path.join(__dirname, '../resumes', `${req.user.id}.pdf`);

        const output = fs.createWriteStream(outputFilePath);
        const pdf = latex(input);

        pdf.pipe(output);
        pdf.on('error', (err) => {
            console.error('Error generating PDF:', err);
            res.status(500).send('Error generating PDF.');
        });

        pdf.on('finish', () => {
            // Attach the generated file paths to the request object
            req.generatedResume = {
                latexFilePath: latexFilePath,
                pdfFilePath: outputFilePath
            };

            next(); // Pass control to the next middleware or route handler
        });

    } catch (err) {
        console.error('Error processing resume data:', err);
        res.status(500).send('Error processing resume data.');
    }
};

module.exports = generateResumeMiddleware;
