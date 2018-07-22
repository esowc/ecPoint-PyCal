import { connect } from 'react-redux'

import Parameters from './component'

import {
  setDateStartField,
  setDateEndField,
  setAccField,
  setLimSUField,
  setRangeField,
  setOutPath
} from './actions'

const mapStateToProps = state => ({
  parameters: state.parameters
})

const mapDispatchToProps = dispatch => ({
  onOutPathChange: path => dispatch(setOutPath(path)),

  onParametersDateStartFieldChange: value => dispatch(setDateStartField(value)),

  onParametersDateEndFieldChange: value => dispatch(setDateEndField(value)),

  onParametersAccFieldChange: value => dispatch(setAccField(value)),

  onParametersLimSUFieldChange: value => dispatch(setLimSUField(value)),

  onParametersRangeFieldChange: value => dispatch(setRangeField(value))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Parameters)