class GameCard {
  constructor(title, description, image, link) {
    this.title = title;
    this.description = description;
    this.image = image;
    this.link = link;
  }

  generateCard() {
    const card = document.createElement('div');
    card.className = "bg-white rounded-2xl shadow-lg hover:shadow-2xl transition p-4 flex flex-col items-center";

    card.innerHTML = `
      <img src="${this.image}" alt="${this.title}" class="rounded-xl w-full h-40 object-cover mb-4">
      <h2 class="text-xl font-semibold text-gray-800 mb-2">${this.title}</h2>
      <p class="text-gray-600 text-sm mb-4 text-center">${this.description}</p>
      <a href="${this.link}" class="mt-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition">Play</a>
    `;
    return card;
  }
}


const games = [
  new GameCard(
    "Verbal Memory",
    "Remember words you've seen before — test your language recall skills!",
    "https://images.unsplash.com/photo-1508780709619-79562169bc64?w=600",
    "VerbalMemoryGame.html"
  ),
  new GameCard(
    "Sequence Memory",
    "Memorize patterns and test your visual recall abilities.",
    "https://www.lumabox.com/wp-content/uploads/2021/09/flipping-tiles-holiday-house-video-digital-decoration-projection-mapping-luma-box-product-image-1200x1200.jpg",
    "SequenceMemoryGame.html"
  )
];

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("game-container");
  games.forEach(game => {
    container.appendChild(game.generateCard());
  });
});
