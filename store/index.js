export const state = () => ({
  sidebar: false,
  issues: null
})

export const mutations = {
  toggleSidebar (state) {
    state.sidebar = !state.sidebar
  },
  setIssues (state, data) {
    state.issues = data
  },
  lock: function (state, item) {
    if (item.lockedColor === 'primary') {
      item.lockedColor = 'error'
      item.lockedText = 'Locked'
    } else {
      item.lockedColor = 'primary'
      item.lockedText = 'Unlocked'
    }
  }
}
