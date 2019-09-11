

export default function BrandChecker(sku) {
    var brand = ''
    if (sku.includes("HOL") || sku.includes("HC") || sku.includes("HG")) {
      brand = 'Holle: '
    } else if (sku.includes("LB")) {
      brand = 'Lebenswert: '
    } else if (sku.includes("HIPP") || sku.includes("HP")) {
      brand = 'HiPP: '
    } else if (sku.includes("TPFR")) {
      brand = 'Topfer: '
    } else if (sku.includes("PN")) {
      brand = 'Powder Nest: '
    } else if (sku.includes("CC")) {
      brand = 'Crinkle Cloth: '
    } else if (sku.includes("T-")) {
      brand = 'Rubbabu: '
    } else {
      if (sku.length == 3) {
        switch(sku.charAt(0)) {
          case 'A':
            brand = sku.charAt(1) == 1 && sku.charAt(2) >= 2 ? 'Natures Paradise: ' : 'Lac Larde: '
            break
          case 'B':
            brand = sku.charAt(1) == 2 && 3 <= sku.charAt(2) <= 5 ? 'Boiron: ' : 'BABO Botanicals: '
            break
          case 'C':
              brand = sku.charAt(1) == 0 ? 'Earth Mama: ' : 'Mambino Organics: '
            break
          case 'D':
            brand = 'Earth Mama: '
            break
          case 'E':
            brand = sku.charAt(1) + sku.charAt(1) == 0 && sku.charAt(2) <= 5 ? 'RADIUS: ' : 'Green Goo: '
            break
          case 'F':
            brand = "Jack N' Jill: "
            break
          case 'G':
            brand = 'Mambino Organics: '
            break
          case 'H':
            brand = "Lafe's Natural Bodycare: "
            break
        }
      }
    }
    return brand
  }