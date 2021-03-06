import React from 'react'
import styled from 'react-emotion'
import { withProps } from 'recompose'
import { DashboardEnchance } from '../Core/global'

import Vending from './Vending'
import Selling from './Selling'

class Seller extends React.Component {
  state = {
    storage: [],
    totalAmounts: [],
    totalPrices: 0,
    currentAmount : 0,
    sellerName: '',
    clear: false,
    err: false
  }

  setErr = (val) => {
    this.setState({
      err : val
    })
  }

  handleAmount = async (id, amount) => {
    let totalAmounts = this.state.totalAmounts
    totalAmounts[id] = await amount
    this.handleState()
  }
  
  handleStorage = async storage => {
    let totalAmounts = []
    let tempStorage = storage.map((data, key) => {
      totalAmounts[key] = data.amount
    })
    await this.setState({
      storage: storage,
      totalAmounts: totalAmounts
    })
    this.handleState()
  }

  clearStorage = () => {
    this.setState({
      storage: [],
      totalAmounts: [],
      totalPrices: 0,
      currentAmount : 0,
      clear: true
    })
    this.forceUpdate()
  }

  handleState = async () => {
    let totalAmounts = await this.state.totalAmounts.reduce((a, b) => a + b, 0)
    let totalPrices = await this.state.storage.reduce((a, b) => { 
      return {
        amount: a.amount + b.amount,
        price: ( a.price + b.amount * b.price) 
      }
    }, { amount: 0, price: 0})
    this.setState({
      currentAmount: totalAmounts,
      totalPrices: totalPrices.price
    })
  }

  handlePrice = price => {
    this.setState({
      totalPrices: this.state.totalPrices + price
    })
  }

  handleRemove = async id => {
    let totalAmounts = await this.state.totalAmounts
    await totalAmounts.splice(id, 1)
    this.setState({
      totalAmounts: totalAmounts
    })
    if(totalAmounts.length > 1) this.handleState()
    else this.setState({currentAmount: 0})
  }

  render() {
    return (
      <DashboardEnchance>
        <div className="row">
          <Selling
            err={this.state.err}
            storage={this.state.storage}
            sentClear={this.state.clear}
            setErr={this.setErr}
            handleStorage={this.handleStorage}
            handlePrice={this.handlePrice}
            handleAmount={this.handleAmount}
            handleRemove={this.handleRemove}
            />
          <Vending
            err={this.state.err}
            clearStorage={this.clearStorage}
            storage={this.state.storage}
            totalAmounts={this.state.currentAmount}
            totalPrices={this.state.totalPrices}
            setErr={this.setErr}
            name={this.props.user.name}
            id={this.props.user.id}
          />
        </div>
      </DashboardEnchance>
    )
  }
}

export default Seller

