import { Set } from 'immutable'

const defaultState = []

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'COMPUTATIONS.ADD': {
      return [
        ...state,
        {
          index: state.length,
          name: action.name,
          field: action.field,
          inputs: action.inputs,
        },
      ]
    }

    case 'COMPUTATIONS.REMOVE': {
      return state.filter(item => item.index !== action.index)
    }

    case 'COMPUTATIONS.UPDATE_NAME':
      return state.map(item => {
        if (item.index === action.index) {
          return { ...item, name: action.name }
        }
        return item
      })

    case 'COMPUTATIONS.UPDATE_FIELD':
      return state.map(item => {
        if (item.index === action.index) {
          return { ...item, field: action.field }
        }
        return item
      })

    case 'COMPUTATIONS.UPDATE_INPUTS':
      return state.map(item => {
        if (item.index === action.index) {
          return { ...item, inputs: action.inputs }
        }
        return item
      })

    default: {
      return state
    }
  }
}