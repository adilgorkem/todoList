// Form Selection
const form = document.querySelector("#todo-form");
//Input Selection
const todoInput = document.querySelector("#todo");
// Ul Selection: As todos will be added into Ul
const todoList = document.querySelector(".list-group");
// Card Selection: As an alert will show up in card
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
// Filter Input Selection
const filter = document.querySelector("#filter");
// Button Selection
const clearButton = document.querySelector("#clear-todos");




eventListeners();
function eventListeners() { // All event listeners are in this function



    // 1. Adding todo when Form is submitted

    form.addEventListener("submit", addTodo);


    // 8. Getting todos from storage to UI when DOMContentLoaded

    document.addEventListener("DOMContentLoaded", loadAllTodosToUI);

    // 9. Deleting Todos from UI
    secondCardBody.addEventListener("click", deleteTodo);

    // 11. Todo Filter
    filter.addEventListener("keyup", filterTodos);

    // 12. Clear All Tasks
    clearButton.addEventListener("click", clearAllTodos);

    // 13. If todolist is empty delete hr tag
    document.addEventListener("DOMContentLoaded", deleteHr);

}
function deleteHr() {
    const hr1 = document.querySelectorAll(".hR1");
    if (todoList.firstElementChild === null) {
        const hr1 = document.querySelectorAll(".hR1");
    hr1.forEach(function (item){
        item.setAttribute("style","border: none");
    })
}

else {
    hr1.setAttribute("style","border: 1px");
}
    }


function addTodo(e) { // 1
    //const newTodo = todoInput.value;
    //console.log(newTodo); // 1'in çalıştığını göstermek için örnek. Ancak ınput'a girilen değerde karakter boşluklarını da hesaba katıyor. Örneğin "görkem" yerine "   görkem    " yazılırsa o şekilde kaydediyor.Bunu engellemek için TRIM metodu kullanılır.
    const newTodo = todoInput.value.trim(); //Baştaki ve sondaki boşlukları yok sayıyor ancak aradaki boşlukları yok saymnıyor. Ör: Şeyma      Zincir
    // console.log(newTodo);
    let todos = getTodosFromStorage();

    // 4. If the value is "" prevent adding to the list

    //5. Alert

    if (newTodo === "") {
        showAlert("danger", "Please Add a Todo:)"); //Inputun Boş olması durumunda showAlert(type,message) adlı fonksiyon çalışacak. Oluşan alertin type'ına göre(success,danger...) alertin rengi ve verilen mesaj değişecek. Bootstrap alert'leri kullanılarak yapılacak. Ör: alert alert-danger: Kırmızı renkli alert oluşturur.
    }
    else if (todos.indexOf(newTodo) === -1)//Boş değil ise ve todos key'inde newTodo değeri yok ise
    {// 2. Todo'nun arayüze eklenmesi buradan başlayacak. newTodo kullanıcı arayüzüne eklenecek.
        addTodotoUI(newTodo);



        // 7. Adding todos to storsge
        addTodotoStorage(newTodo);


        showAlert("success", newTodo + " başarıyla eklendi.") //5
    }
    else { //Todos içinde newTodo değeri var ise daha önce eklenmiş anlamı taşır.

        if (confirm("Bu todo zaten kayıtlı. Yine de eklemek ister misin?")) {
            addTodotoUI(newTodo);
            addTodotoStorage(newTodo);
            showAlert("success", newTodo + " başarıyla eklendi.")
        }
        else { showAlert("warning", "Todo yeniden eklenmedi."); }
    }


    // 2. Adding todo to UI

    // addTodotoUI(newTodo); // Else block içerisine eklendiği için yoruma alınacak.

    e.preventDefault(); // Bu her zaman en aşağıda kalmalı
}
//2
function addTodotoUI(newTodo) { //String value will be added to UI as a a list-item

    //List Item
    const listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex justify-content-between";

    //Link
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = `<i class = "fa fa-remove"></i>`; //Burada yaptığımız a etiketi içerisine ikon eklemek. Yani ikona tıklandığında link gibi çalışacak(2)

    // Oluşturulan list item'ın içerisine input'a girilen değer Text Node olarak eklenmeli.
    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link); //Yani ul içerisinde oluşacak olan li etiketinin içerisinde solda yukarıda girilen input text değeri, ortada boşluk (çünkü justify-content-between css özelliği seçildi) ve sağda link şeklinde ikon bulunacak.

    //Todo List'e(ul içerisine) list item'ı ekleme
    todoList.appendChild(listItem);



    // 3. Clear input after adding todo

    todoInput.value = "";

}
// 7
function addTodotoStorage(newTodo) { //Bu fonksiyonu her yerde kullandığımız için genel bir fonksiyon şeklinde düzenledik.
    let todos;
    todos = getTodosFromStorage(); // Getting todos from storage
    todos.push(newTodo); //Pushing newtodo to array
    localStorage.setItem("todos", JSON.stringify(todos)); //Stringify method is used because todos can not be added to local storage as array object
}

function getTodosFromStorage() {
    let todos;

    if (localStorage.getItem("todos") === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem("todos")); //JSON parsing is the process of converting a JSON object in text format to a Javascript object that can be used inside a program.
    }
    return todos;

}


//4-5

function showAlert(type, message) {

    const hr = document.createElement("hr"); //Formun altına çizgi çektik çünkü alert olarak eklenecek div form'daki button'ın hemen altına geliyor ve çirkin bir görüntü oluşuyor. Tabi div'i oluştururken margin-top da verebiliriz.
    const alert = document.createElement("div"); //Div oluşturma
    alert.className = `alert alert-${type}`; //Div'e bootstrap alert tipine göre class atama, buna göre css özellikleri değişecek.
    alert.textContent = message; //type'a göre değişen mesaj özelliği

    //EXTRA: If else block'u kendimiz ekledik. Çünkü Todo Ekle Butonu'na multiple click yapıldığında ardı ardına alert geliyordu. Dolayısıyla butona tıklandığında aynı class'a sahip başka bir div var ise(demek ki 1 sn dolmadan multiple click yapılmış), o divi silmemiz gerekiyor.
    if (document.querySelector(`.alert-${type}`)) {
        return
    }
    else {
        firstCardBody.appendChild(hr); //hr etiketini mesaj verme durumunda ekliyoruz. Normalde sayfamızda görünmüyor.
        firstCardBody.appendChild(alert); //Alert'in eklenmesi



        // 6. Delete Alert
        //alert.remove(); // Bunu yaptığımızda alert'ü görmeden siliniyor.
        //hr.remove();

        //setTimeout Metodu ile alert'e belirli bir süre vereceğiz, sonra silinecek.

        setTimeout(function () {
            alert.remove();
            hr.remove();
        }, 1000) //setTimeout'un 2 tane girdisi var: 1. Fonksiyon 2.Fonksiyonun ne kadar sonra çalışacağını belirten süre(miliseconds)
    }
}

// 8
function loadAllTodosToUI() {
    let todos = getTodosFromStorage();
    todos.forEach(function (todo) {
        addTodotoUI(todo);
    })
}

// 9
function deleteTodo(e) {
    console.log(e.target); //İkona tıklandığında e.target ikonu gösterecek mi?
    if (e.target.className === "fa fa-remove") {
        //console.log("Silme İşlemi");

        if (confirm("Silme işlemi onaylandığında todo kalıcı olarak silinir. İşlemi onaylıyor musunuz?") === true) {
            e.target.parentElement.parentElement.remove();
            deleteTodoFromStorage(e.target.parentElement.parentElement.textContent); // 10. Bu fonksiyonu silme ikonuna basılınca çalıştırmalıyız
            showAlert("success", e.target.parentElement.parentElement.textContent + " başarıyla silindi")
        }
        else {
            return;
        }

        //Eğer tıklanan yer ikon ise, o ikonun parent'ının (a tag'i) parent'ına (li tag'i) git ve onu sil ve daha sonra o li'nin text contentinde yazan todo değerinin silindiği mesajını ver işlemi yapıldı

        //Ancak henüz bu değerleri local storage'dan silmedik.
    }
}

// 10. Remove todos from storage
function deleteTodoFromStorage(deletetodo) {
    let todos = getTodosFromStorage(); //Todolar array olarak geldi
    todos.forEach(function (todo, index) {
        if (todo === deletetodo) {
            todos.splice(index, 1); //Splice: Belirtilen index değerinden itibaren(belirtilen index dahil) kaç tane index silineceğini söyler. Yani bu örnekte Array'den yalnızca bir index değeri silmiş olduk. 
        }
    });

    localStorage.setItem("todos", JSON.stringify(todos)); // 10 Son olarak local storage'ı da tekrar güncellememiz gerekiyor.
};

// 11
function filterTodos(e) {
    const filterValue = e.target.value.toLowerCase();
    const filterValuewithoutspace = filterValue.split(" ").join("");
    const listItems = document.querySelectorAll(".list-group-item");
    listItems.forEach(function (listItem) {
        const text = listItem.textContent.toLowerCase();
        const textwithoutspace = text.split(" ").join("");
        if (textwithoutspace.indexOf(filterValuewithoutspace) === -1) {
            listItem.setAttribute("style", "display : none !important");
        }
        else {
            listItem.setAttribute("style", "display : block");
        }
        //Fonksiyon çalışmadı çünkü Bootstrap özelliği olan d-flex display: none'ı ezdi. Aslında html etiketlerine display: none style'ı eklendi. O nedenle display: none IMPORTANT(!important) olacak. 
    })
}

// 12

function clearAllTodos() {

    // Todoları UI'dan Temizleme
    if (confirm("Tümünü silmek istediğinize emin misiniz?")) {
        // todoList.innerHTML = ""; // Bu yöntem removeChild'a göre yavaş kaldığı için vazgeçtik

        while (todoList.firstElementChild != null) {
            todoList.firstElementChild.remove();
            //or
            // todolist.removeChild(todolist.firstElementChild);
        }
        localStorage.removeItem("todos"); // local storage'da key değerini silerek tüm itemlerı oradan temizlemiş olduk
    }

}

