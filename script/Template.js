export function ParseAlarmList (data) {
    const { hour, minute, second, title, id} = data;

    const $mainContainer = document.createElement('li');
    $mainContainer.classList.add('alarm_list_item');

    const $contentsContainer = document.createElement('div');
    $contentsContainer.classList.add('date_tiem_container');

    const $time = document.createElement('span');
    $time.classList.add('alarm_time_text');
    $time.textContent = `${hour}시 ${minute}분 ${second}초`;

    const $title = document.createElement('span');
    $title.classList.add('alarm_time_title');
    $title.textContent = `${title}`;

    const $deleteBtn = document.createElement('button');
    $deleteBtn.dataset.id = id;
    $deleteBtn.classList.add('alarm_delete_btn');
    
    $deleteBtn.textContent = '삭제';

    $contentsContainer.appendChild($time);
    $contentsContainer.appendChild($title);

    $mainContainer.appendChild($contentsContainer);
    $mainContainer.appendChild($deleteBtn);

    return {
        template : $mainContainer,
        info : data,
    }
}
