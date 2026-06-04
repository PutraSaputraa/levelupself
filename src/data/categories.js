export const selfCategories = [
  {
    id: 'strength',
    name: 'Strength',
    description: 'Bangun tenaga, kontrol tubuh, dan kekuatan dasar.',
  },
  {
    id: 'intelect',
    name: 'Intelect',
    description: 'Latih fokus, belajar, membaca, dan keterampilan berpikir.',
  },
  {
    id: 'mental',
    name: 'Mental',
    description: 'Jaga ketenangan, refleksi, dan kejernihan emosi.',
  },
  {
    id: 'stamina',
    name: 'Stamina',
    description: 'Tingkatkan daya tahan, energi harian, dan pemulihan.',
  },
]

export const categoryAliases = {
  cardio: 'stamina',
  calistenic: 'strength',
  fitness: 'strength',
  focus: 'intelect',
  habit: 'stamina',
  health: 'stamina',
  learning: 'intelect',
  mindfulness: 'mental',
  productivity: 'intelect',
  reading: 'intelect',
  recovery: 'stamina',
  reflection: 'mental',
  skill: 'intelect',
}

export function getCategoryLabel(categoryId) {
  return selfCategories.find((category) => category.id === categoryId)?.name ?? categoryId
}
