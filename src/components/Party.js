import './Party.css'

import {Card, CardHeader, CardText, CardTitle} from 'material-ui/Card';
import React, { Component } from 'react'

import Map from './Map'
import NotFound from './NotFound'
import RefreshIndicator from 'material-ui/RefreshIndicator'
import { connectProfile } from '../auth'
import firebase from 'firebase'

class Party extends Component {
  static propTypes = {
    ...connectProfile.PropTypes
  }

  constructor (props) {
    super(props)
    this.state = {
      isLoaded: false,
      notFound: false,
      party: {},
      skedulr: {}
    }
  }

  componentDidMount () {
    const { id } = this.props.params
    this.partyRef = firebase.database().ref(`/parties/${id}`)
    this.partyRef.on('value', snapshot => {
      const party = snapshot.val()
      if (!party) {
        return this.setState({ notFound: true })
      }
      this.skedulrRef = firebase.database().ref(`/users/${party.skedulr}`)
      this.skedulrRef.on('value', snapshot => {
        const skedulr = snapshot.val()
        this.setState({ isLoaded: true, party, skedulr })
      })
    })
  }

  componentWillUnmount () {
    this.partyRef && this.partyRef.off()
    this.skedulrRef && this.skedulrRef.off()
  }

  render() {
    const { id } = this.props.params
    const { address, title, description } = this.state.party
    const { picture, name } = this.state.skedulr
    const style = {
      refresh: {
        display: 'inline-block',
        position: 'relative',
      }
    }
    return this.state.notFound ? <NotFound /> : (
      <div className='Party'>
        {this.state.isLoaded ? (
          <div className='Party-Content'>
            <Map firebaseRef={`/parties/${id}`} />
            <div className="Party-Card">
              <Card>
                <CardHeader
                  title="Organized by"
                  subtitle={name}
                  avatar={picture}
                />
                <CardTitle title={title} subtitle={address} />
                <CardText>
                  {description}
                </CardText>
              </Card>
            </div>
          </div>
          ) : (
          <div className='Party-Loader'>
            <RefreshIndicator
              size={40}
              left={0}
              top={0}
              status="loading"
              style={style.refresh}
            />
          </div>
          )
        }
      </div>
    )
  }
}

export default connectProfile(Party)
