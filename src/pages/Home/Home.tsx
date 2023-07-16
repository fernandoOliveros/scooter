import { Fragment } from "react"
import Menu from "../../components/shared/Menu"

const Home = () => {
  return (
    <Fragment>
       <div className="container-fluid">
          <div className="row page-titles">
              <div className="col-md-5 col-sm-12 col-xs-12  align-self-center">
                  <h3 className="card-title">Bienvenido</h3>
              </div>
              <div className="col-md-7 col-sm-12 col-xs-12 align-self-center text-end">
                  <div className="d-flex justify-content-end align-items-center">
                      <ol className="breadcrumb justify-content-end">
                          <li className="breadcrumb-item active">Home</li>
                      </ol>
                  </div>
              </div>
          </div>
        </div>
        <Menu />
    </Fragment>
  )
}

export default Home