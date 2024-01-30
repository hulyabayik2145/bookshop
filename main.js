  let bookList = [],
      basketList = [];

//toggle menu
const toggleModal = () => {
    const basketModal = document.querySelector(".basket_modal");
   basketModal.classList.toggle("active")
}

const getBooks = () => {
    fetch("./products.json")
    .then((res) => res.json())
    .then((books) => (bookList = books))
    .catch((err) => console.log(err));
}
getBooks();

//dinamik yıldızlar oluşturuldu.

const  createBookStars = (starRate) => {
   // console.log(starRate);
    let starRateHtml = ""
    for (let i=1;i<=5;i++){
        if(Math.round(starRate) >=i){
            starRateHtml += `<i class="bi bi-star-fill active"></i>`;
            } else {
                starRateHtml += `<i class="bi bi-star-fill"></i>`

        }
    }
    return starRateHtml;
};

//html oluşturuldu, kitap listesi buraya aktarıldı.

const createBookItemsHtml = () => {
    const bookListEl = document.querySelector(".book_list");
    let bookListHtml = "" ;
    bookList.forEach((book,index) => {
       // console.log(book);
        bookListHtml += `
            <div class="col-5 ${index % 2== 0 && "offset-2"} my-5">
        <div class="row book_card">
            <div class="col-6">
                <img src="${book.imgSource}" 
                alt="" class="img-fluid shadow" width="258px"
                    height="400px"/>
            </div>
            <div class="col-6 d-flex flex-column justify-content-center gap-4">
                <div class="book_detail">
                    <span class="fos gray fs-5">${book.author}</span><br>
                    <span class="fs-4 fw-bold">${book.name}</span><br>
                    <span class="book_star-rate">
                    ${createBookStars(book.starRate)}
                        <span class="gray">1938 reviews</span>
                    </span>
                </div>
                <p class="book_description fos gray">${book.description}
                    </p>
                <div>
                    <span class="black fw-bold fs-4 me-2">${book.price}tl</span>
                    <span class="fs-d fw-bold old_price">${book.oldPrice ? `
                    <span class="fs-d fw-bold old_price">${book.oldPrice}tl</span>` : "" }</span>
                </div>
                <button onClick="addBookToBasket(${book.id})" class="btn_purple">Sepete Ekle</button>
            </div>
        </div>
    </div>
        
        `;
    });
    bookListEl.innerHTML = bookListHtml;

    
};

const BOOK_TYPES = {
    ALL: "Tümü",
    NOVEL:"Roman",
    CHILDREN :"Çocuk",
    HISTORY:"Tarih",
    FINANCE:"Finans",
    SCIENCE:"Bilim",
    SELFIMPROVEMENT:"Kişisel Gelişim",
};

const createBookTypesHtml = () => {
    const filterEle = document.querySelector(".filter");
    let filterHtml = "";
    //filtre türlerini tutacak dizi,"ALL" türüyle başlatılomıştır.
    let filterTypes = ["ALL"];
    bookList.forEach((book) => {
        //eger filtre türleri dizisinde bu tür bulunmuyorsa ekleme işlemi yapar
    if (filterTypes.findIndex((filter) => filter == book.type) == -1){
        filterTypes.push(book.type);

    }
    });

    //console.log(filterTypes);

    filterTypes.forEach((type,index) => {
        //console.log(type);
        filterHtml += ` <li onClick="filterBooks(this)" data-types="${type}" 
        class="${index == 0 ? "active" : null}">${BOOK_TYPES[type] || type}</li>`;
    });

    
 
   filterEle.innerHTML = filterHtml;
   };
   

   const filterBooks = (filterEl) => {
   // console.log(filterEl);
    document.querySelector(".filter .active").classList.remove("active");
    filterEl.classList.add("active");
    let bookType = filterEl.dataset.types;
   // console.log(bookType);
    getBooks();
    if(bookType != "ALL"){
        console.log(bookType);
        bookList =bookList.filter((book) => book.type == bookType);
        
    }
   
    createBookItemsHtml();
   };
   const listBasketItems = () =>{
    const basketListEl =  document.querySelector(".basket_list");
    const basketCountEl = document.querySelector(".basket_count");
    console.log(basketList);
    const totalQuantity = basketList.reduce((total,item)=> total + item.quantity,0);
    basketCountEl.innerHTML = totalQuantity > 0 ? totalQuantity :null;
    
    
    const totalPriceEl = document.querySelector(".total_price");
    console.log(totalPriceEl);
    let totalPrice = 0;
    let basketListHtml ="";
    basketList.forEach((item) => {
       // console.log(item);
       totalPrice+= item.product.price*item.quantity;
        basketListHtml += `
          <li class="basket_item">
      <img src="${item.product.imgSource}" alt="" width="100" height="100">
      <div class="basket_item-info">
          <h3 class="book_name">${item.product.name}</h3>
          <span class="book_price">${item.product.price}</span><br>
          <span class="book_remove" onClick="removeItemBasket(${item.product.id})">Sepetten Kaldır</span>
      </div>
      <div class="book_count">
          <span class="decrease" onClick="decreaseItemToBasket(${item.product.id})">-</span>
          <span class="mx-2">${item.quantity}</span>
          <span class="increase" onClick="increaseItemToBasket(${item.product.id})">+</span>
      </div>
  </li>
        
        `;

    });
   basketListEl.innerHTML = basketListHtml ? basketListHtml : 
    `<li class="basket_item" >Sepetiniz Boş!</li>` ;

    
    
    

   // totalPriceEl.innerText=totalPrice.toFixed(2)+' TL';
    totalPriceEl.innerHTML = totalPrice > 0 ? "total:"  + totalPrice + "tl" : null;

   }
   //sepete ürün ekleme
   const addBookToBasket = (bookId)=> {
    let findedBook =  bookList.find((book)=> book.id == bookId);
   // console.log(findedBook);
    if(findedBook){
        //sepetteki ürünün var olup olmadığını kontrool eder.
       const basketAlreadyIndex = basketList.findIndex(
        (basket)=> basket.product.id == bookId

       );

       //eğer sepet boş ise veya eklenen kitap sepette yoksa bu kısım çalışacak
       if(basketAlreadyIndex == -1){
        let addItem = {quantity: 1, product:findedBook};
        basketList.push(addItem);
       }else{
       basketList[basketAlreadyIndex].quantity +=1;
       console.log(basketList);
       }
    }

    const btnCheck =document.querySelector(".btnCheck");
    //console.log(btnCheck);
    btnCheck.style.display = "block";


    //sepet içeriğini guncelle ve görüntüle
    
    listBasketItems();

   
   }
   //sepetteki ürünün miktarını azaltma
   const decreaseItemToBasket = (bookId) => {
   // console.log(bookId);
  const findedIndex = basketList.findIndex(
    (basket) => basket.product.id == bookId
  );
  //eger kitap sepet içinde bulunuyorsa
  if(findedIndex != -1){
    //eger kitabın miktarı 1 den büyük ise
    if(basketList[findedIndex].quantity != 1){
        basketList[findedIndex].quantity -= 1 ;
    }else{

        removeItemBasket(bookId);
    }
  }
  listBasketItems();
   }


   const increaseItemToBasket = (bookId) =>{ 
   

    const findedIndex = basketList.findIndex(
        (basket)=> basket.product.id == bookId
    );

    //kitabın miktarını 1 artırır.
    basketList[findedIndex].quantity += 1;
    listBasketItems();

   

   }

   //sepetten ürünü kaldırır.
   
   const removeItemBasket = (bookId) => {
    const findedIndex = basketList.findIndex(
        (basket) => basket.product.id == bookId
    );

    //eğer kitap sepet içinde bulunuyorsa
    if(findedIndex != -1){

        //splice belirli sayıda eleman silmek için kullanılır
        //sepet listesinden kitabı çıkar
        basketList.splice(findedIndex,1);
        if(findedIndex == 0){
                  const btnCheck = document.querySelector(".btnCheck");
  // console.log(btnCheck);
  btnCheck.style.display = "none";

        }
        

    }else{
      const btnCheck = document.querySelector(".btnCheck");
  // console.log(btnCheck);
  btnCheck.style.display = "none";
  // sepet içeriğini günceller
  listBasketItems();
     
}
    

    //sepet içeriğini günceller
    listBasketItems();
   }

  


setTimeout(() => {
createBookItemsHtml();
createBookTypesHtml();
},100);
