import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Helmet from '../../components/helmet/Helmet'
import { Container, ListGroup, ListGroupItem, Col, Row } from 'reactstrap'
import '../../styles/hero-section.css'

// import Category from '../../components/ui/category/Category.jsx'
import _ from 'lodash'

import './home.scss'

// import products from '../../api/products'

import {
    collection,
    // getDocs,
    onSnapshot,
} from 'firebase/firestore'
import { db } from '../../firebase/firebase_config'
import foodCategoryImg01 from '../../assets/images/hamburger.png'
import foodCategoryImg02 from '../../assets/images/pizza.png'
import foodCategoryImg03 from '../../assets/images/bread.png'
import laptopImg from '../../assets/products/laptop_32px.png'
import mobileImg from '../../assets/products/mobile_32px.png'
import mouseImg from '../../assets/products/mouse_32px.png'

import ProductCard from '../../components/ui/product-card/ProductCard.jsx'
import SaleOff from '../../components/sale_off/SaleOff'
import FamousBrand from '../../components/famous_brand/FamousBrand'
// import DiscountList from '../../components/DiscountList/index'

const Home = () => {
    const [category, setCategory] = useState('ALL')
    const [allProducts, setAllProducts] = useState([])
    const [filter, setFilter] = useState(allProducts)
    const [loading, setLoading] = useState(true)
    const [hotProduct, setHotProduct] = useState([])

    const currentUser = useSelector((state) => state.AuthReducer.currentUser)
    const infoUser = useSelector((state) => state.AuthReducer.infoUser)

    useEffect(() => {
        localStorage.setItem('currentUser', JSON.stringify(currentUser))
        localStorage.setItem('infoUser', JSON.stringify(infoUser))
    }, [currentUser])

    useEffect(() => {
        const unsub = onSnapshot(
            collection(db, 'products'),
            (snapShot) => {
                let list = []
                snapShot.docs.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data() })
                })
                const cloneList = _.clone(list)
                setFilter(cloneList)
                setAllProducts(list)

                const filteredPizza = list.filter((item) => item.category === '??i???n tho???i')
                const slicePizza = filteredPizza.slice(0, 4)
                setHotProduct(slicePizza)
                setLoading(false)
            },
            (error) => {
                console.log(error)
            }
        )
        return () => {
            unsub()
        }
    }, [])
    // console.log('allProducts:', allProducts)
    const filterProduct = (category) => {
        const updateProduct = allProducts.filter((item) => item.category === category)
        setFilter(updateProduct)
    }

    useEffect(() => {
        if (category === 'ALL') {
            setFilter(allProducts)
        }

        if (category === 'Laptop') {
            filterProduct('Laptop')
        }

        if (category === 'Mouse') {
            filterProduct('Mouse')
        }

        if (category === '??i???n tho???i') {
            filterProduct('??i???n tho???i')
        }
    }, [category])

    return (
        <Helmet title="Home">
            <section>
                <SaleOff />
            </section>

            {/* <section className="pt-0">
                <Category />
            </section> */}

            {/* Th????ng hi???u n???i b???t */}
            <section>
                <Container>
                    <Row>
                        <Col className="home__famous-brand bg-white box-sha-home bor-rad-8 ">
                            <FamousBrand />
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Qu???ng c??o */}
            <section>
                <Container>
                    <Row>
                        <Col className="adv">
                            <a href="https://www.apple.com/watch/" target="blank">
                                <img className="adv-img w-100 bor-rad-8" src="https://res.cloudinary.com/tuan-cloudinary/image/upload/v1608268459/others/1_iorzsj.webp" />
                            </a>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section>
                <Container>
                    <Row>
                        <Col lg="12" className="text-center">
                            <h2>S???n ph???m ph??? bi???n</h2>
                        </Col>

                        <Col lg="12">
                            <div className="food__category d-flex align-items-center justify-content-center gap-4">
                                <button className={`all__btn  ${category === 'ALL' ? 'foodBtnActive' : ''} `} onClick={() => setCategory('ALL')}>
                                    All
                                </button>
                                <button className={`d-flex align-items-center gap-2 ${category === 'Laptop' ? 'foodBtnActive' : ''} `} onClick={() => setCategory('Laptop')}>
                                    <img src={laptopImg} alt="" />
                                    Laptop
                                </button>

                                <button className={`d-flex align-items-center gap-2 ${category === '??i???n tho???i' ? 'foodBtnActive' : ''} `} onClick={() => setCategory('??i???n tho???i')}>
                                    <img src={mobileImg} alt="" />
                                    ??i???n tho???i
                                </button>

                                <button className={`d-flex align-items-center gap-2 ${category === 'Mouse' ? 'foodBtnActive' : ''} `} onClick={() => setCategory('Mouse')}>
                                    <img src={mouseImg} alt="" />
                                    Chu???t
                                </button>
                            </div>
                        </Col>

                        {filter.map((item) => (
                            <Col lg="3" md="4" sm="6" xs="6" key={item.id} className="mt-5">
                                <ProductCard item={item} />
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Qu???ng c??o */}
            <section>
                <Container>
                    <Row>
                        <Col className="adv">
                            <a href="https://www.panasonic.com/vn/" target="blank">
                                <img className="adv-img w-100 bor-rad-8" src="https://res.cloudinary.com/tuan-cloudinary/image/upload/v1608268459/others/2_wapowv.webp" />
                            </a>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* S???n ph???m b??n ch???y: Laptop */}
            <section className="pt-0">
                <Container>
                    <Row>
                        <Col lg="12" className="text-center mb-5 ">
                            <h2>S???n ph???m b??n ch???y</h2>
                        </Col>

                        {hotProduct.map((item) => (
                            <Col lg="3" md="4" sm="6" xs="6" key={item.id}>
                                <ProductCard item={item} />
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>
        </Helmet>
    )
}

export default Home
