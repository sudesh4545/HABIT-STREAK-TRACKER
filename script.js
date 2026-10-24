(function () {
        "use strict";
        var KEY = "streakgarden:v1",
          items = [],
          $ = function (x) {
            return document.getElementById(x);
          };
        try {
          items = JSON.parse(localStorage.getItem(KEY) || "[]");
        } catch (x) {}
        function dates() {
          var out = [],
            d = new Date();
          d.setDate(d.getDate() - 6);
          for (var i = 0; i < 7; i++) {
            out.push(d.toISOString().slice(0, 10));
            d.setDate(d.getDate() + 1);
          }
          return out;
        }
        function save() {
          localStorage.setItem(KEY, JSON.stringify(items));
        }
        function streak(x) {
          var n = 0,
            d = new Date();
          for (var i = 0; i < 365; i++) {
            var k = d.toISOString().slice(0, 10);
            if (x.done.includes(k)) n++;
            else if (i > 0) break;
            d.setDate(d.getDate() - 1);
          }
          return n;
        }
        function draw() {
          $("habits").innerHTML = items.length
            ? ""
            : '<p class="hint">Add your first habit above.</p>';
          var ds = dates();
          items.forEach(function (x) {
            var row = document.createElement("article");
            row.className = "habit";
            row.innerHTML =
              "<div><h3></h3><p>" +
              streak(x) +
              " day streak · double-click title to delete</p></div><div class='days'></div>";
            row.querySelector("h3").textContent = x.name;
            row.querySelector("h3").ondblclick = function () {
              if (confirm("Delete habit?")) {
                items = items.filter(function (a) {
                  return a.id !== x.id;
                });
                save();
                draw();
              }
            };
            ds.forEach(function (d) {
              var b = document.createElement("button");
              b.className = "day" + (x.done.includes(d) ? " done" : "");
              b.textContent = new Date(d + "T12:00").toLocaleDateString([], {
                weekday: "narrow",
              });
              b.style.setProperty("--a", x.color);
              b.onclick = function () {
                x.done = x.done.includes(d)
                  ? x.done.filter(function (a) {
                      return a !== d;
                    })
                  : x.done.concat(d);
                save();
                draw();
              };
              row.querySelector(".days").appendChild(b);
            });
            $("habits").appendChild(row);
          });
        }
        $("add").onclick = function () {
          var n = $("name").value.trim();
          if (!n) return;
          items.push({
            id: crypto.randomUUID(),
            name: n,
            color: $("color").value,
            done: [],
          });
          $("name").value = "";
          save();
          draw();
        };
        draw();
      })();

(function(){
        "use strict";
        var KEY="streakgarden:v2",items=[],$=function(id){return document.getElementById(id)};
        try{items=JSON.parse(localStorage.getItem(KEY)||"[]")}catch(e){}
        if(!items.length)items=[{id:crypto.randomUUID(),name:"Drink water",frequency:"daily",target:8,color:"#38bdf8",logs:{}},{id:crypto.randomUUID(),name:"Code for 30 minutes",frequency:"daily",target:1,color:"#8b5cf6",logs:{}}];
        document.querySelector(".add").hidden=true;$("habits").hidden=true;$("enhancedHabit").hidden=false;
        function key(date){var y=date.getFullYear(),m=String(date.getMonth()+1).padStart(2,"0"),d=String(date.getDate()).padStart(2,"0");return y+"-"+m+"-"+d}
        function week(){var out=[],d=new Date();d.setDate(d.getDate()-6);for(var i=0;i<7;i++){out.push(new Date(d));d.setDate(d.getDate()+1)}return out}
        function scheduled(item,date){var day=date.getDay();return item.frequency==="daily"||(item.frequency==="weekdays"&&day>0&&day<6)||(item.frequency==="weekends"&&(day===0||day===6))}
        function done(item,date){return(item.logs[key(date)]||0)>=item.target}
        function streak(item){var count=0,d=new Date();for(var i=0;i<365;i++){if(!scheduled(item,d)){d.setDate(d.getDate()-1);continue}if(done(item,d))count++;else if(i>0)break;d.setDate(d.getDate()-1)}return count}
        function save(){localStorage.setItem(KEY,JSON.stringify(items))}
        function draw(){var days=week(),today=new Date(),scheduledToday=items.filter(function(x){return scheduled(x,today)}),completeToday=scheduledToday.filter(function(x){return done(x,today)}).length;$("todayRate").textContent=(scheduledToday.length?Math.round(completeToday/scheduledToday.length*100):0)+"%";$("totalStreak").textContent=Math.max(0,...items.map(streak));$("weekDone").textContent=items.reduce(function(sum,x){return sum+days.filter(function(d){return done(x,d)}).length},0);$("habitList").innerHTML=items.length?"":'<p class="hint">Add your first habit.</p>';
          items.forEach(function(item){var card=document.createElement("article");card.className="habit-card";card.style.setProperty("--habit",item.color);var current=item.logs[key(today)]||0;card.innerHTML="<div class='head'><div><h3></h3><p class='hint'></p></div><div><button class='minus'>−</button><b class='value'></b><button class='plus'>+</button><button class='delete'>×</button></div></div><div class='progress-track'><span></span></div><div class='week'></div>";card.querySelector("h3").textContent=item.name;card.querySelector("p").textContent=item.frequency+" · target "+item.target+" · "+streak(item)+" day streak";card.querySelector(".value").textContent=" "+current+"/"+item.target+" ";card.querySelector(".progress-track span").style.width=Math.min(100,current/item.target*100)+"%";card.querySelector(".minus").onclick=function(){item.logs[key(today)]=Math.max(0,current-1);save();draw()};card.querySelector(".plus").onclick=function(){item.logs[key(today)]=Math.min(item.target,current+1);save();draw()};card.querySelector(".delete").onclick=function(){if(confirm("Archive/delete this habit?")){items=items.filter(function(x){return x.id!==item.id});save();draw()}};days.forEach(function(date){var b=document.createElement("button"),k=key(date);b.textContent=date.toLocaleDateString([],{weekday:"narrow"});b.disabled=!scheduled(item,date);b.className=done(item,date)?"done":"";b.title=k;b.onclick=function(){item.logs[k]=done(item,date)?0:item.target;save();draw()};card.querySelector(".week").appendChild(b)});$("habitList").appendChild(card)});
        }
        $("habitAdd").onclick=function(){var name=$("habitName").value.trim();if(!name)return;items.push({id:crypto.randomUUID(),name:name.slice(0,50),frequency:$("habitFrequency").value,target:Math.max(1,Math.min(20,+$("habitTarget").value||1)),color:["#8b5cf6","#ec4899","#38bdf8","#ef4444"][items.length%4],logs:{}});$("habitName").value="";save();draw()};
        function coachReply(text){var lower=text.toLowerCase(),pending=items.filter(function(x){return scheduled(x,new Date())&&!done(x,new Date())}).map(function(x){return x.name});if(lower.includes("plan")||lower.includes("today"))return pending.length?"Today's smallest plan: "+pending.map(function(x){return"do "+x+" once"}).join(", ")+". Start with the easiest one.":"Everything scheduled today is complete. Review what made it work.";if(lower.includes("motivat")||lower.includes("lazy")||lower.includes("block"))return"Reduce the habit until it feels impossible to refuse: two minutes, one page, one glass, or one repetition. Consistency first, intensity later.";if(lower.includes("streak"))return"Your strongest active streak is "+Math.max(0,...items.map(streak))+" days. Protect it with a tiny minimum version on busy days.";return"Choose one clear cue, one tiny action and one reward. For your current list, focus on "+(pending[0]||items[0]?.name||"one useful habit")+" next."}
        $("coachSend").onclick=function(){var text=$("coachInput").value.trim();if(!text)return;var user=document.createElement("div");user.className="bubble user";user.textContent=text;$("coachMessages").appendChild(user);var reply=document.createElement("div");reply.className="bubble";reply.textContent=coachReply(text);$("coachMessages").appendChild(reply);$("coachInput").value="";$("coachMessages").scrollTop=$("coachMessages").scrollHeight};
        $("coachInput").onkeydown=function(e){if(e.key==="Enter")$("coachSend").click()};
        $("copyChatGPT").onclick=async function(){var summary=items.map(function(x){return x.name+" (target "+x.target+", streak "+streak(x)+")"}).join("; "),prompt="Act as a practical habit coach for Sudesh. Current habits: "+summary+". Give a short, realistic plan for today, identify one likely obstacle, and suggest a two-minute fallback for each habit. Do not shame the user.";try{await navigator.clipboard.writeText(prompt);$("coachStatus").textContent="ChatGPT coaching prompt copied ✓"}catch(e){$("coachStatus").textContent="Clipboard blocked."}};
        save();draw();
      })();
