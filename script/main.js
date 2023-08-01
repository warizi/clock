import ListManager from "./ListManager.js";
import { ParseAlarmList } from "./Template.js";
import Dot from "./canvas.js";
import Square from "./square.js";
import AlarmStorage from "./storage.js";

(function main() {
    // clock
    const $clockDate = document.querySelector('.clock_date');

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    $clockDate.textContent = `${year}.${month}.${day}`;
    updateTime();
    let timeChange = setInterval(updateTime, 1000);

    // bettery
    const $chargeArea = document.querySelector('.charge_area');
    let stateOfCharging = false;
    let betteryCount = 10;
    let betteryChange = setInterval(updateBettery, 1000);
    // alarm
    const $hourInput = document.getElementById('hour_input');
    const $minuteInput = document.getElementById('minute_input');
    const $secondInput = document.getElementById('second_input');
    const $hourUpBtn = document.getElementById('hour_up_btn');
    const $hourDownBtn = document.getElementById('hour_down_btn');
    const $minuteUpBtn = document.getElementById('minute_up_btn');
    const $minuteDownBtn = document.getElementById('minute_down_btn');
    const $secondUpBtn = document.getElementById('second_up_btn');
    const $secondDownBtn = document.getElementById('second_down_btn');
    const $alarmText = document.querySelector('.alarm_text');
    const $addAlarmBtn = document.querySelector('.add_alarm_btn');
    const $listContainer = document.querySelector('.alarm_list_container');
    const DB = new AlarmStorage();
    const alarmList = new ListManager($listContainer, ParseAlarmList);
    alarmList.init(DB.getList());
    alarmList.render();
    
    $hourUpBtn.addEventListener('click', () => updateNumberHandler($hourInput, 'up'));
    $hourDownBtn.addEventListener('click', () => updateNumberHandler($hourInput, 'down'));    
    $minuteUpBtn.addEventListener('click', () => updateNumberHandler($minuteInput, 'up'));
    $minuteDownBtn.addEventListener('click', () => updateNumberHandler($minuteInput, 'down'));
    $secondUpBtn.addEventListener('click', () => updateNumberHandler($secondInput, 'up'));
    $secondDownBtn.addEventListener('click', () => updateNumberHandler($secondInput, 'down'));

    $hourInput.addEventListener('input', (e) => {
        const value = e.target.value;
        if (isNaN(value) || Number(value) > 23 || Number(value) < 0) {
            $hourInput.value = 0;
        }
    });
    $minuteInput.addEventListener('input', (e) => {
        const value = e.target.value;
        if (isNaN(value) || Number(value) > 59 || Number(value) < 0) {
            $minuteInput.value = 0;
        }
    });
    $secondInput.addEventListener('input', (e) => {
        const value = e.target.value;
        if (isNaN(value) || Number(value) > 59 || Number(value) < 0) {
            $secondInput.value = 0;
        }
    });
    $addAlarmBtn.addEventListener('click', (e) => {
        const hourValue = $hourInput.value;
        const minuteValue = $minuteInput.value;
        const secondValue = $secondInput.value;
        const titleValue = $alarmText.value;
        const listData = {
            id: DB.getId(),
            hour: hourValue,
            minute: minuteValue,
            second: secondValue,
            title: titleValue,
        }
        if(confirm('알람을 등록하시겠습니까?')){
            if(DB.getList().length < 3){
                DB.addList(listData);
                alarmList.init(DB.getList()).clearList().render();
            } else {
                alert('3개를 초과할 수 없습니다.');
            }
        }
    });
    alarmList.addEvent('click', deleteItemEvent);
    function deleteItemEvent (e) {
        const activeElem = e.target;
        if(activeElem.classList[0] === 'alarm_delete_btn') {
            const id = activeElem.dataset.id;
            if(confirm('삭제하시겠습니까?')){
                DB.deleteList(id);
                alarmList.init(DB.getList()).clearList().render();
            }
        }
    }
    
    

    // drawing line
    setCableDrag();
    let drawing = setInterval(drawingLine, 1000 / 60);

    const dots = document.querySelectorAll('.circle');
    const dot0 = new Dot(0, 245, 0);
    const dot1 = new Dot(0, 270, 1);
    const dot2 = new Dot(0, 300, 2);
    const dot3 = new Dot(0, 220, 3);
    const dot4 = new Dot(0, 150, 4);
    const squares = document.querySelectorAll('.square');
    const square0 = new Square(squares[0]);
    const square1 = new Square(squares[1]);
    const square2 = new Square(squares[2]);
    const square3 = new Square(squares[3]);
    const square4 = new Square(squares[4]);

    const cableHeadLocated = {x: 300, y: 50};

    dot0.locateDot(dots[0]);
    
    let stateOfDrop = true;
    let dropSpeed = 0;
    let positiveSpeed = 0;
    let nagativeSpeed = 0;
    let gravity = 1;
    let plusGravity = 0.001;

    function drawingLine () {
        dot1.locateDot(dots[1]).setDistance(cableHeadLocated.x, cableHeadLocated.y);
        dot2.locateDot(dots[2]).setDistance(cableHeadLocated.x, cableHeadLocated.y);
        dot3.locateDot(dots[3]).setDistance(cableHeadLocated.x, cableHeadLocated.y);
        dot4.locateDot(dots[4]).setDistance(cableHeadLocated.x, cableHeadLocated.y);
        square0.setPosition(dot0.distanceX, dot0.distanceY, dot1.distanceX, dot1.distanceY);
        square1.setPosition(dot1.distanceX, dot1.distanceY, dot2.distanceX, dot2.distanceY);
        square2.setPosition(dot2.distanceX, dot2.distanceY, dot3.distanceX, dot3.distanceY);
        square3.setPosition(dot3.distanceX, dot3.distanceY, dot4.distanceX, dot4.distanceY);
        square4.setPosition(dot4.distanceX, dot4.distanceY, cableHeadLocated.x, cableHeadLocated.y);
        dropCable();
    }

  

    // helper Fn
    function updateNumberHandler (dom, type = 'up') {
        const oldNumber = Number(dom.value);
        switch(type) {
            case 'up':
                if(oldNumber < 59 && dom.name !== '시간') {
                    dom.value = Number(dom.value) + Number(1);
                } else if (oldNumber < 23 && dom.name === '시간') {
                    dom.value = Number(dom.value) + Number(1);
                }
                break;
            case 'down':
                if(oldNumber > 0) {
                    dom.value = Number(dom.value) - Number(1);
                }
                break;
        }
    }
    function setChargeState (stateBoolean) {
        stateOfCharging = stateBoolean;
        if(betteryCount === 0 && stateOfCharging) {
            setCharging();
        } else if (!stateOfCharging) {
        }
    }
    function dropCable () {
        const cableHead = document.querySelector('.cable_head');
        if(cableHeadLocated.y < 700 && stateOfDrop) {
            dropSpeed = dropSpeed + gravity;
            gravity = gravity + plusGravity;
            cableHeadLocated.y = cableHeadLocated.y + dropSpeed;
            cableHead.style.transform = `translate(${cableHeadLocated.x}px, ${cableHeadLocated.y}px) rotate(90deg)`;
        } else {
            plusGravity = 0
            dropSpeed = 0;
        }
        if(cableHeadLocated.y > 230 && cableHeadLocated.x > 1 && stateOfDrop && nagativeSpeed <= positiveSpeed) {
            positiveSpeed = positiveSpeed + 0.5;
            cableHeadLocated.x = cableHeadLocated.x - positiveSpeed;
            cableHead.style.transform = `translate(${cableHeadLocated.x}px, ${cableHeadLocated.y}px) rotate(90deg)`;
        } else if (cableHeadLocated.y > 230 && cableHeadLocated.x < -1 && stateOfDrop && nagativeSpeed <= positiveSpeed) {
            positiveSpeed = positiveSpeed - 1;
            cableHeadLocated.x = cableHeadLocated.x - positiveSpeed;
            cableHead.style.transform = `translate(${cableHeadLocated.x}px, ${cableHeadLocated.y}px) rotate(90deg)`;
        } else if (cableHeadLocated.y > 230 && cableHeadLocated.x < -1 && stateOfDrop && nagativeSpeed >= positiveSpeed) {
            // 반대 시작
            nagativeSpeed = nagativeSpeed + 0.5;
            cableHeadLocated.x = cableHeadLocated.x + nagativeSpeed;
            cableHead.style.transform = `translate(${cableHeadLocated.x}px, ${cableHeadLocated.y}px) rotate(90deg)`;
        } else if (cableHeadLocated.y > 230 && cableHeadLocated.x > 1 && stateOfDrop && nagativeSpeed >= positiveSpeed) {
            nagativeSpeed = nagativeSpeed - 1;
            cableHeadLocated.x = cableHeadLocated.x + nagativeSpeed;
            cableHead.style.transform = `translate(${cableHeadLocated.x}px, ${cableHeadLocated.y}px) rotate(90deg)`;
        } else {
            nagativeSpeed = 0;
            positiveSpeed = 0;
        }
    }
    function updateBettery () {
        const $bettery = document.querySelector('.bettery_count');
        if(!stateOfCharging) {
            if(betteryCount > 0 && betteryCount <= 20) {
                betteryCount--;
                $bettery.style.width = `${betteryCount}px`;
                $bettery.style.backgroundColor = `#FF3104`;
            } else if(betteryCount > 20 && betteryCount <= 65) {
                betteryCount--;
                $bettery.style.width = `${betteryCount}px`;
                $bettery.style.backgroundColor = `#FFC804`;
            } else if (betteryCount > 65 && betteryCount <= 100) {
                betteryCount--;
                $bettery.style.width = `${betteryCount}px`;
                $bettery.style.backgroundColor = `#71fe6e`;
            } else if (betteryCount === 0) {
                setDischarged();
            }
        } else {
            if(betteryCount >= 0 && betteryCount < 100) {
                betteryCount = betteryCount + 1;
                $bettery.style.width = `${betteryCount}px`;
                $bettery.style.backgroundColor = `#71fe6e`;
            } else if (betteryCount === 0) {
                setDischarged();
            }
        }
    }

    function setCableDrag () {
        const $activeArea = document.querySelector('.cable_acitve_area');
        const $cable = document.querySelector('.cable_head');
        
        $cable.onmousedown = function(e) {
            const transform = new DOMMatrix(window.getComputedStyle($cable).getPropertyValue('transform'));
            const translateX = transform.m41;
            const translateY = transform.m42;
            const areaX = e.target.getBoundingClientRect().left;
            const areaY = e.target.getBoundingClientRect().top;

            setLocateCable(e);
            
            document.addEventListener('mousemove', setLocateCable);
            document.onmouseup = function () {
                const transform = new DOMMatrix(window.getComputedStyle($cable).getPropertyValue('transform'));
                const translateY = transform.m42;
                const translateX = transform.m41;
                if(translateY < 10 && translateX > 60 && translateX < 130) {
                    stateOfDrop = false;
                } else {
                    stateOfDrop = true;
                }
                document.removeEventListener('mousemove', setLocateCable);
                document.onmouseup = null;
            }
            function moveCable (locateX, locateY, angleDegress) {
                stateOfDrop = false;
                if(locateX > 60 && locateX < 130 && locateY < 10) {
                    $chargeArea.style.boxShadow = '2px 0 100px 50px rgba(100, 200, 100, 0.8)';
                    setChargeState(true);
                } else {
                    $chargeArea.style.boxShadow = '2px 0 30px 10px rgba(100, 200, 200, 0.8)';
                    setChargeState(false);
                }
                $cable.style.transform = `translate(${locateX}px, ${locateY}px) rotate(${angleDegress}deg)`;
            }

            function setLocateCable(event) {
                const pageX = event.clientX;
                const pageY = event.clientY;
                const xInArea = pageX - areaX + translateX - 10;
                const yInArea = pageY - areaY + translateY - 26;
                const angleRadians = Math.atan2(xInArea, yInArea - 240);
                const angleDegress = -((angleRadians * 180) / Math.PI - 90);
                const centerY = 230;
                const radius = 500;
                if(isWithInCircle(xInArea, yInArea) && yInArea > 0){
                    cableHeadLocated.x = xInArea;
                    cableHeadLocated.y = yInArea;
                    moveCable(xInArea, yInArea, angleDegress - 20);
                } else {
                    const scale = radius / Math.sqrt((xInArea * xInArea) + ((yInArea - centerY) * (yInArea - centerY)));
                    cableHeadLocated.x = xInArea * scale;
                    cableHeadLocated.y = yInArea < 0 ? 0 :yInArea * scale;
                    moveCable(xInArea * scale, yInArea < 0 ? 0 :yInArea * scale, angleDegress - 20);

                }
                function isWithInCircle(x, y) {
                    return x * x + (Math.abs(y) - Math.abs(centerY)) * (Math.abs(y) - Math.abs(centerY)) <= radius * radius;
                }
            }
        };
        $activeArea.ondragstart = (e) => false;
    }

    function setDischarged () {
        const $clockContainer = document.querySelector('.clock_container');
        const $blink = document.querySelectorAll('.blink_animation');
        $blink[0].style.animationPlayState = `paused`;
        $blink[1].style.animationPlayState = `paused`;

        $clockContainer.style.backgroundColor = 'black';
        $clockContainer.style.color = 'gray';
        clearInterval(betteryChange);
        clearInterval(timeChange);
    }
    function setCharging () {
        const $clockContainer = document.querySelector('.clock_container');
        const $blink = document.querySelectorAll('.blink_animation');
        $blink[0].style.animationPlayState = `running`;
        $blink[1].style.animationPlayState = `running`;

        $clockContainer.style.backgroundColor = '#280d4b';
        $clockContainer.style.color = 'white';
        betteryCount++;
        $chargeArea.style.boxShadow = '2px 0 50px 20px rgba(100, 200, 100, 0.8)';
        betteryChange = setInterval(updateBettery, 1000);
        timeChange = setInterval(updateTime, 1000);
    }
    function updateTime () {
        const $hour = document.querySelector('.clock_time_hour');
        const $minute = document.querySelector('.clock_time_minute');
        const $second = document.querySelector('.clock_time_second');

        const time = new Date();
        const hour = time.getHours();
        const minute = time.getMinutes();
        const second = time.getSeconds();

        if(hour < 10) {
            $hour.textContent = `0${hour}`;
        } else {
            $hour.textContent = hour;
        }
        if(minute < 10) {
            $minute.textContent = `0${minute}`;
        } else {
            $minute.textContent = minute;
        }
        if(second < 10) {
            $second.textContent = `0${second}`;
        } else {
            $second.textContent = second;
        }
    }
})();
