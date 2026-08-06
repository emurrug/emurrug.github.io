const card = document.getElementById("card");
const cursorCore = document.querySelector(".cursor-core");
const cursor = document.querySelector(".custom-cursor");
const interactables = document.querySelectorAll(".interactable");
const logo = document.querySelector(".logo");
const dialogue = document.getElementById("dialogueWindow");
const closeDialogue = document.getElementById("closeDialogue");
const dialogueHeader = document.querySelector(".terminal-header");
const roleLinks = document.querySelectorAll(".role:not(#tinkerer)");

let terminalBusy = false;
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

const isMobile = 
    window.matchMedia("(max-width: 768px)").matches ||
    window.matchMedia("(pointer: coarse)").matches;

if (isMobile) {
    document.querySelector(".scene").style.display = "none";
    document.getElementById("mobileMessage").style.display = "block";
    document.querySelector(".custom-cursor").style.display = "none";
    mobileBootSequence();   
}
const terminal = {

    body: document.querySelector(".terminal-body"),

    session: 0,

    clear(){
        this.body.innerHTML = "";
    },

    async write(lines){

        const currentSession = ++this.session;

        this.clear();

        for(const line of lines){

            if(currentSession !== this.session){
                return;
            }
            if(line.command === "clear"){

            await new Promise(resolve =>
                setTimeout(resolve, line.pause ?? 500)
            );
             if(currentSession !== this.session){
             return;
    }
            this.clear();
            continue;
        }

            await this.type(
                line.text,
                line.speed ?? 50,
                line.pause ?? 500,
                currentSession,
                line === lines[lines.length - 1]
            );
        }
    },


    async type(text="", speed=50, pause=400, session, keepCursor=false){

        const line=document.createElement("p");
        line.classList.add("typing");

        this.body.appendChild(line);

        for(const character of text){

            if(session !== this.session){
                return;
            }

            line.textContent += character;

            await new Promise(resolve =>
                setTimeout(resolve, Math.random()*25+speed)
            );
        }


        await new Promise(resolve =>
            setTimeout(resolve,pause)
        );


        if(session === this.session && !keepCursor){
            line.classList.remove("typing");
        }

    }

};

document.addEventListener("mousemove",(event)=>{

    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const maxRotation = 10; 

    const rotateY = Math.max(
        -maxRotation,
        Math.min(maxRotation, (x-centerX)/40)
    );

    const rotateX = Math.max(
        -maxRotation,
        Math.min(maxRotation, -(y-centerY)/40)
    );

    card.style.transform =
        `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        
    cursor.style.left = event.clientX + "px";
    cursor.style.top = event.clientY + "px";

    
    if (!isDragging) return;
    dialogue.style.left =
        (event.clientX - offsetX) + "px";
    dialogue.style.top =
        (event.clientY - offsetY) + "px";

    dialogue.style.right = "auto";


});

document.addEventListener("mouseleave",()=>{

    card.style.transform =
        "rotateX(0deg) rotateY(0deg)";
});

document.addEventListener("mousedown",()=>{
    cursorCore.classList.add("clicking");
});

dialogueHeader.addEventListener("mousedown", (event)=>{
    isDragging = true;

    const rect = dialogue.getBoundingClientRect();

    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;

    dialogueHeader.style.cursor = "grabbing";

    event.preventDefault();

});

document.addEventListener("mouseup",()=>{

    cursorCore.classList.remove("clicking");
    
    isDragging = false;

    dialogueHeader.style.cursor = "grab";
});

interactables.forEach(item => {
    item.addEventListener("mouseenter",()=>{

        cursorCore.classList.add("active");

    });
    item.addEventListener("mouseleave",()=>{

        cursorCore.classList.remove("active");

    });

});

logo.addEventListener("click", async () => {

    dialogue.classList.add("active");

    terminal.clear();

    await terminal.write([
        {
            text: "> initializing curiosity...",
            speed: 50,
            pause: 1000
        },
        {
            text: "> indexing memories...",
            speed: 50,
            pause: 800
        },
        {
            text: "> reticulating splines...",
            speed: 50,
            pause: 1500
        },
        {
            text: "> found: 23 unfinished projects",
            speed: 50,
            pause: 1200
        },
        {
            text: "> ...",
            speed: 200,
            pause: 1000
        },
        {
            text: "> hello, friend.",
            speed: 60,
            pause: 500
        },
        //{
        //    command: "clear",
        //    pause: 1000
        //},
        {
            text: "> thanks for visiting.",
            speed: 60,
            pause: 1000
        },
        {
            text: "> you've arrived a little early.",
            speed: 60,
            pause: 1800
        },
        {
            text: "> ...",
            speed: 200,
            pause: 400
        },
        {
            text: "> please",
            speed: 60,
            pause: 500
        },
        {
            text: "> stay as long as you like..",
            speed: 60,
            pause: 500
        },
        {
            text: "> ..then visit again another day.",
            speed: 60,
            pause: 400
        }
    ]);

});

closeDialogue.addEventListener("click", () => {
    dialogue.classList.remove("active");
    terminal.clear();
});

closeDialogue.addEventListener("mousedown", (event) => {
    event.stopPropagation();
});

roleLinks.forEach(role => {

    role.addEventListener("click", async (event)=>{

        event.preventDefault();

        const destination = role.href;

        dialogue.classList.add("active");

        terminal.clear();

        await terminal.write([
            {
                text:`> opening ${role.textContent.toLowerCase()} archive...`,
                speed:50,
                pause:800
            },
            {
                text:"> redirecting...",
                speed:80,
                pause:1000
            }
        ]);

        window.location.href = destination;

    });

});
const tinkerer = document.getElementById("tinkerer");

if(tinkerer) {
    tinkerer.addEventListener("click", async () => {
    event.preventDefault();
    dialogue.classList.add("active");

    await terminal.write([
        {
            text: "> opening tinkerer archive...",
            speed: 50,
            pause: 800
        },
        {
            text: "> searching directory...",
            speed: 50,
            pause: 1000
        },
        {
            text: "> ...",
            speed: 100,
            pause: 1200
        },
        {
            text: "> huh.",
            speed: 60,
            pause: 1500
        },

        {
            text: "> looks like this section is still being tinkered with.",
            speed: 60,
            pause: 1500
        },
        {
            text: "> how appropriate.",
            speed: 50,
            pause: 1200
        },
    ]);

});
} 

async function mobileBootSequence() {

    const terminal = document.getElementById("mobileTerminalBody");

    const lines = [
        {
            text: "> detecting display environment...",
            pause: 1200
        },
        {
            text: "> detecting...",
            pause: 1200
        },
        {
            text: "> detecting...",
            pause: 3000
        },
        {
            text: "> oh.",
            pause: 1800
        },
        {
            text: "> you're on a phone.",
            pause: 2000
        },
        {
            text: "> ...",
            pause: 1000
        },
        {
            text: "> interesting.",
            pause: 2300
        },
        //{
        //command: "clear",
        //pause: 500
        //},

        {
            text: "> unfortunately, this particular exhibit",
            pause: 600
        },
        {
            text: "> prefers a full-sized room.",
            pause: 1000
        },
        {
            text: "> lets try a larger window next time,",
            pause: 150
        },
        {   text: "> shall we?",
            pause: 999999
        }
    ];

    for (const line of lines) {

        if (line.command === "clear") {

            await new Promise(resolve =>
                setTimeout(resolve, line.pause ?? 500)
            );

            terminal.innerHTML = "";

            continue;
        }
        const p = document.createElement("p");
        terminal.appendChild(p);

        for (const char of line.text) {

            p.textContent += char;

            await new Promise(resolve =>
                setTimeout(resolve, Math.random()*50 + 90)
            );
        }

        const cursor = document.createElement("span");
        cursor.textContent = "█";
        cursor.classList.add("cursor");

        p.appendChild(cursor);

        await new Promise(resolve =>
            setTimeout(resolve, line.pause ?? 500)
        );
cursor.remove();
    }
}
