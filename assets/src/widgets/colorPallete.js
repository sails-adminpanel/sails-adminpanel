const colorPallete = [
    'rgba(143, 116, 123, 0.6)', //  Darker Pastel Pink
    'rgba(105, 143, 118, 0.6)', //  Darker Pastel Green
    'rgba(143, 105, 105, 0.6)', //  Darker Pastel Red
    'rgba(105, 143, 143, 0.6)', //  Darker Pastel Blue
    'rgba(143, 105, 72, 0.6)',  //  Darker Pastel Orange
    'rgba(143, 143, 72, 0.6)',  //  Darker Pastel Yellow
    'rgba(124, 105, 143, 0.6)', //  Darker Pastel Purple
    'rgba(105, 143, 127, 0.6)', //  Darker Pastel Turquoise
    'rgba(143, 104, 143, 0.6)', //  Darker Pastel Lavender
    'rgba(143, 128, 104, 0.6)', //  Darker Pastel Peach
    'rgba(105, 143, 100, 0.6)', //  Darker Pastel Mint
    'rgba(129, 105, 143, 0.6)', //  Darker Pastel Lilac
    'rgba(143, 105, 143, 0.6)', //  Darker Pastel Magenta
    'rgba(105, 143, 143, 0.6)', //  Darker Pastel Cyan
    'rgba(143, 135, 105, 0.6)', //  Darker Pastel Apricot
    'rgba(105, 143, 135, 0.6)'  //  Darker Pastel Sky Blue
];
function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }
  
  function getDefaultColorByID(key){
    const hash = hashCode(key.toString());
    const index = Math.abs(hash % colorPallete.length)
    return colorPallete[index] || colorPallete[0]
  }


module.exports = { getDefaultColorByID };