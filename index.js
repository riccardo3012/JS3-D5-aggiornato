document.addEventListener("DOMContentLoaded", () => {
  const loadingIndicator = document.getElementById("loadingIndicator");
  const endPoint = "https://striveschool-api.herokuapp.com/api/product/";
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGU4NmQyNjY4NWVjNDAwMTQ1MGI4ZGUiLCJpYXQiOjE2OTI5NTM4OTQsImV4cCI6MTY5NDE2MzQ5NH0.VeeKtQLhOBlMQ6RwOeUj6LN65bU7fCUJzz2vQEJNmX8";

  const productForm = document.getElementById("productForm");
  const productCardsContainer = document.getElementById("productCards");

  productForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    loadingIndicator.style.display = "block";
    const productName = document.getElementById("productName").value;
    const productDescription = document.getElementById("productDescription")?.value;
    const productBrand = document.getElementById("productBrand")?.value;
    const productImageUrl = document.getElementById("productImageUrl")?.value;
    const productPrice = parseFloat(document.getElementById("productPrice").value);

    const newObj = {
      name: productName,
      description: productDescription,
      brand: productBrand,
      imageUrl: productImageUrl,
      price: productPrice,
    };

    try {
      const response = await fetch(endPoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newObj),
      });
      const createdProduct = await response.json();
      const card = document.createElement("div");
      card.classList.add("card");
      card.classList.add("col-md-4");
      card.classList.add("m-2");
      card.innerHTML = `
                <div  class="card-body">
                <img src="${createdProduct.imageUrl}" class="card-img-top" alt="${createdProduct.name}">
                    <h5 class="card-title">${createdProduct.name}</h5>
                    <p class="card-text">${createdProduct?.description}</p>
                    <p class="card-text card-brand">Brand: ${createdProduct?.brand}</p>
                    <p class="card-text card-price">Price: $${createdProduct?.price}</p>
                    <button class="btn btn-danger delete-button" data-product-id="${createdProduct?._id}">Elimina</button>
                    <button class="btn btn-primary details-button" data-product-id="${createdProduct._id}">Dettagli</button>
                </div>
            `;
      productCardsContainer.appendChild(card);
      productForm.reset();
      loadingIndicator.style.display = "none";
    } catch (error) {
      console.error("Errore durante la creazione della risorsa:", error);
      loadingIndicator.style.display = "none";
    }
  });
  const resetButton = document.getElementById("resetButton");
  resetButton.addEventListener("click", () => {
    const confirmed = window.confirm("Sei sicuro di voler resettare il form?");
    if (confirmed) {
      productForm.reset();
    }
  });

  productCardsContainer.addEventListener("click", async (event) => {
    loadingIndicator.style.display = "block";
    const clickedButton = event.target.closest(".delete-button");
    const clickedDetailsButton = event.target.closest(".details-button");
    if (clickedButton) {
      const confirmed = window.confirm("Sei sicuro di voler eliminare questo prodotto?");
      if (confirmed) {
        const productId = clickedButton.getAttribute("data-product-id");
      }
      try {
        const response = await fetch(`${endPoint}${productId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const cardToRemove = clickedButton.closest(".card");
          cardToRemove.remove();
        } else {
          console.error("Errore durante l'eliminazione del prodotto");
        }
        loadingIndicator.style.display = "none";
      } catch (error) {
        console.error("Errore durante l'eliminazione del prodotto:", error);
        loadingIndicator.style.display = "none";
      }
    } else if (clickedDetailsButton) {
      const productId = clickedDetailsButton.getAttribute("data-product-id");
      try {
        const response = await fetch(`${endPoint}${productId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const product = await response.json();
          localStorage.setItem("selectedProduct", JSON.stringify(product));

          window.location.href = "index2.html";
        } else {
          console.error("Errore durante il recupero dei dettagli del prodotto");
        }
      } catch (error) {
        console.error("Errore durante il recupero dei dettagli del prodotto:", error);
      }
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const endPoint = "https://striveschool-api.herokuapp.com/api/product/";
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGU4NmQyNjY4NWVjNDAwMTQ1MGI4ZGUiLCJpYXQiOjE2OTI5NTM4OTQsImV4cCI6MTY5NDE2MzQ5NH0.VeeKtQLhOBlMQ6RwOeUj6LN65bU7fCUJzz2vQEJNmX8";

  const editButton = document.getElementById("editButton");
  const cancelEditButton = document.getElementById("cancelEditButton");
  const confirmEditButton = document.getElementById("confirmEditButton");
  const editForm = document.getElementById("editForm");

  if (editButton && cancelEditButton && confirmEditButton && editForm) {
    const selectedProduct = JSON.parse(localStorage.getItem("selectedProduct"));
    const productImage = document.getElementById("productImage");
    const productName = document.getElementById("productName");
    const productDescription = document.getElementById("productDescription");
    const productBrand = document.getElementById("productBrand");
    const productPrice = document.getElementById("productPrice");

    productImage.src = selectedProduct.imageUrl;
    productName.textContent = selectedProduct.name;
    productDescription.textContent = selectedProduct.description;
    productBrand.textContent = selectedProduct.brand;
    productPrice.textContent = selectedProduct.price;

    editButton.addEventListener("click", () => {
      document.getElementById("editedProductName").value = selectedProduct.name;
      document.getElementById("editedProductDescription").value = selectedProduct.description;
      document.getElementById("editedProductBrand").value = selectedProduct.brand;
      document.getElementById("editedProductImageUrl").value = selectedProduct.imageUrl;
      document.getElementById("editedProductPrice").value = selectedProduct.price;

      editForm.classList.remove("d-none");
      editButton.classList.add("d-none");
    });

    cancelEditButton.addEventListener("click", () => {
      editForm.classList.add("d-none");
      editButton.classList.remove("d-none");
    });
    confirmEditButton.addEventListener("click", async () => {
      const updatedName = document.getElementById("editedProductName").value;
      const updatedDescription = document.getElementById("editedProductDescription").value;
      const updatedBrand = document.getElementById("editedProductBrand").value;
      const updatedImageUrl = document.getElementById("editedProductImageUrl").value;
      const updatedPrice = parseFloat(document.getElementById("editedProductPrice").value);
      const updatedObj = {
        name: updatedName,
        description: updatedDescription,
        brand: updatedBrand,
        imageUrl: updatedImageUrl,
        price: updatedPrice,
      };
      try {
        const response = await fetch(`${endPoint}${selectedProduct._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedObj),
        });
        if (response.ok) {
          productName.textContent = updatedName;
          productDescription.textContent = updatedDescription;
          productBrand.textContent = updatedBrand;
          editForm.classList.add("d-none");
          editButton.classList.remove("d-none");
        } else {
          console.error("Errore durante l'aggiornamento del prodotto");
        }
      } catch (error) {
        console.error("Errore durante l'aggiornamento del prodotto:", error);
      }
    });
  }
});
