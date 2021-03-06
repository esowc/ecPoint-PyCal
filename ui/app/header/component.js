import React, { Component, createRef } from 'react'

import { Divider, Dropdown, Image, Menu, Sticky } from 'semantic-ui-react'
import logo from '~/assets/img/ECMWF_logo.png'

const mainProcess = require('@electron/remote').require('./server')
const jetpack = require('fs-jetpack')

const MenuFragment = ({ title, children, divider }) => (
  <>
    <Dropdown.Header>{title}</Dropdown.Header>
    {children}
    {divider && <Divider />}
  </>
)

export default class Header extends Component {
  render() {
    return (
      <Menu fixed="top" borderless inverted>
        <Menu.Item>
          <Image src={logo} size="small" />
        </Menu.Item>

        <Menu.Item>
          <span style={{ color: 'white' }}>
            v{window.require('electron').remote.app.getVersion()}
          </span>
        </Menu.Item>

        <Menu.Menu position="right">
          <Dropdown item text="Menu">
            <Dropdown.Menu>
              {['B', 'C'].includes(this.props.workflow) && (
                <MenuFragment title="Import">
                  {this.props.workflow === 'C' && (
                    <Dropdown.Item
                      disabled={this.props.page.activePageNumber !== 2}
                      onClick={() =>
                        this.props.onSaveOperationClicked('breakpoints-upload')
                      }
                    >
                      Breakpoints (CSV)
                    </Dropdown.Item>
                  )}

                  {this.props.workflow === 'B' && (
                    <Dropdown.Item
                      disabled={this.props.page.activePageNumber === 3}
                      onClick={() => {
                        const path = mainProcess.openFile() || null
                        if (path === null) {
                          return
                        }

                        const state = JSON.parse(jetpack.read(path))
                        this.props.loadWorkflow(state)
                        this.props.warmupPredictorMetadataCache(state.predictors.path)
                      }}
                    >
                      Workflow
                    </Dropdown.Item>
                  )}
                </MenuFragment>
              )}

              {['B', 'C'].includes(this.props.workflow) && (
                <MenuFragment title="Export">
                  {this.props.workflow === 'C' && (
                    <>
                      <Dropdown.Item
                        disabled={this.props.page.activePageNumber !== 2}
                        onClick={() => this.props.onSaveOperationClicked('breakpoints')}
                      >
                        Breakpoints (CSV)
                      </Dropdown.Item>
                      <Dropdown.Item
                        disabled={this.props.page.activePageNumber !== 2}
                        onClick={() => this.props.onSaveOperationClicked('mf')}
                      >
                        Mapping Functions (CSV)
                      </Dropdown.Item>
                      <Dropdown.Item
                        disabled={this.props.page.activePageNumber !== 2}
                        onClick={() => this.props.onSaveOperationClicked('wt')}
                      >
                        Weather Types (PNG)
                      </Dropdown.Item>
                      <Dropdown.Item
                        disabled={this.props.page.activePageNumber !== 2}
                        onClick={() => this.props.onSaveOperationClicked('bias')}
                      >
                        Weather Type biases
                      </Dropdown.Item>
                      <Dropdown.Item
                        disabled={this.props.page.activePageNumber !== 2}
                        onClick={() => this.props.onSaveOperationClicked('all')}
                      >
                        Operational calibration files
                      </Dropdown.Item>
                    </>
                  )}
                  {this.props.workflow === 'B' && (
                    <Dropdown.Item
                      disabled={this.props.page.activePageNumber !== 3}
                      onClick={() => {
                        const path = mainProcess.saveFile('workflow.json') || null
                        if (path === null) {
                          return
                        }

                        jetpack.write(path, this.props.reduxState)
                      }}
                    >
                      Workflow
                    </Dropdown.Item>
                  )}
                </MenuFragment>
              )}

              <MenuFragment title="Navigation" divider={false}>
                <Dropdown.Item onClick={() => this.props.resetApp()}>
                  Home
                </Dropdown.Item>
              </MenuFragment>
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Menu>
    )
  }
}
