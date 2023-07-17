import {Component} from 'react'

import Loader from 'react-loader-spinner'

import ProjectItem from '../ProjectItem'

import Header from '../Header'

import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class Home extends Component {
  state = {
    categoryOptionId: categoriesList[0].id,
    apiStatus: apiStatusConstants.initial,
    projectsList: [],
  }

  componentDidMount() {
    this.getProjectsList()
  }

  getProjectsList = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {categoryOptionId} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${categoryOptionId}`
    const response = await fetch(url)
    if (response.ok) {
      const data = await response.json()
      // console.log(data)
      const formattedData = data.projects.map(eachObj => ({
        id: eachObj.id,
        imageUrl: eachObj.image_url,
        name: eachObj.name,
      }))
      this.setState({
        projectsList: formattedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeOption = event => {
    this.setState({categoryOptionId: event.target.value}, this.getProjectsList)
    console.log(event.target.value)
  }

  renderSuccessView = () => {
    const {projectsList} = this.state
    // console.log(projectsList)
    return (
      <ul className="projects-container">
        {projectsList.map(each => (
          <ProjectItem key={each.id} projectDetails={each} />
        ))}
      </ul>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" color="#0b69ff" width={50} height={50} />
    </div>
  )

  onClickRetry = () => {
    this.getProjectsList()
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="warning">Oops! Something Went Wrong</h1>
      <p className="text">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" className="retry" onClick={this.onClickRetry}>
        Retry
      </button>
    </div>
  )

  renderParticularView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="container">
          <select onChange={this.onChangeOption} className="select">
            {categoriesList.map(eachList => (
              <option key={eachList.id} value={eachList.id}>
                {eachList.displayText}
              </option>
            ))}
          </select>
          {this.renderParticularView()}
        </div>
      </>
    )
  }
}
export default Home
