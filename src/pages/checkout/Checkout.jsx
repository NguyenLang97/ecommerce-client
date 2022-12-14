import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Container, Row, Col } from 'reactstrap'
import CommonSection from '../../components/ui/common-section/CommonSection'
import Helmet from '../../components/helmet/Helmet'
import { doc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase/firebase_config'

import './checkout.css'
import CartTable from '../cart_page/cartTable/CartTable'

const Checkout = () => {
    const cartItems = useSelector((state) => state.CartReducer.cartItems)
    const totalQuantity = useSelector((state) => state.CartReducer.totalQuantity)
    console.log({ totalQuantity })
    const totalAmount = useSelector((state) => state.CartReducer.totalAmount)
    console.log({ cartItems })
    const { address, phone, fullname, email } = useSelector((state) => state.AuthReducer.infoUser)
    const userId = useSelector((state) => state.AuthReducer.currentUser)

    const [enterFullName, setEnterFullName] = useState(fullname)
    const [enterEmail, setEnterEmail] = useState(email)
    const [enterPhone, setEnterPhone] = useState(phone)
    const [enterAddress, setEnterAddress] = useState(address)

    const cartTotalAmount = useSelector((state) => state.CartReducer.totalAmount)
    const shippingCost = 30

    const totalAmountOrder = cartTotalAmount + Number(shippingCost)

    const submitHandler = async (e) => {
        e.preventDefault()
        const userShippingAddress = {
            name: enterFullName,
            email: enterEmail,
            phone: enterPhone,
            address: enterAddress,
            userId: userId,
            cartItems,
            totalQuantity,
            totalAmountOrder,
        }

        console.log({ userShippingAddress })

        try {
            await addDoc(collection(db, 'order'), {
                ...userShippingAddress,
                timeStamp: serverTimestamp(),
            })
            // navigate(-1)
        } catch (err) {
            console.log(err)
            // setError(true)
        }
    }

    return (
        <Helmet title="Checkout">
            <CommonSection title="Checkout" />
            <selection>
                <Container>
                    <Row>
                        <Col lg="12">
                            <CartTable />
                        </Col>
                    </Row>
                </Container>
            </selection>
            <section>
                <Container>
                    <Row>
                        <Col lg="8" md="6">
                            <h6 className="mb-4">Th??ng tin giao h??ng</h6>
                            <form className="checkout__form" onSubmit={submitHandler}>
                                <div className="form__group">
                                    <label htmlFor="">T??n ng?????i nh???n</label>
                                    <input type="text" placeholder="Enter your name" required value={enterFullName} onChange={(e) => setEnterFullName(e.target.value)} />
                                </div>

                                <div className="form__group">
                                    <label htmlFor="">Email</label>

                                    <input type="email" placeholder="Enter your email" value={enterEmail} required onChange={(e) => setEnterEmail(e.target.value)} />
                                </div>
                                <div className="form__group">
                                    <label htmlFor="">S??? ??i???n tho???i</label>

                                    <input type="number" placeholder="Phone number" value={enterPhone} required onChange={(e) => setEnterPhone(e.target.value)} />
                                </div>
                                <div className="form__group">
                                    <label htmlFor="">?????a ch??? nh???n h??ng</label>

                                    <input type="text" placeholder="Country" value={enterAddress} required onChange={(e) => setEnterAddress(e.target.value)} />
                                </div>
                                <div className="p-12 bg-white bor-rad-8 m-tb-16">
                                    <h2 className="m-b-8">Ph????ng th???c thanh to??n</h2>
                                    <p>Th??ng tin thanh to??n c???a b???n s??? lu??n ???????c b???o m???t</p>
                                    <Row gutter={[16, 16]}>
                                        <Col span={24} md={12}>
                                            <div className="p-tb-8 p-lr-16 bg-gray item-active">
                                                <b className="font-size-16px">Thanh to??n khi nh???n h??ng</b>
                                                <p>Thanh to??n b???ng ti???n m???t khi nh???n h??ng t???i nh?? ho???c showroom.</p>
                                            </div>
                                        </Col>
                                        <Col span={24} md={12}>
                                            <div className="p-tb-8 p-lr-16 bg-gray">
                                                <b className="font-size-16px">Thanh to??n Online qua c???ng VNPAY</b>
                                                <p>Thanh to??n qua Internet Banking, Visa, Master, JCB, VNPAY-QR.</p>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>

                                <button type="submit" className="addTOCart__btn">
                                    ?????T H??NG NGAY
                                </button>
                            </form>
                        </Col>

                        <Col lg="4" md="6">
                            <div className="checkout__bill">
                                <h6 className="d-flex align-items-center justify-content-between mb-3">
                                    Subtotal: <span>${cartTotalAmount}</span>
                                </h6>
                                <h6 className="d-flex align-items-center justify-content-between mb-3">
                                    Shipping: <span>${shippingCost}</span>
                                </h6>
                                <div className="checkout__total">
                                    <h5 className="d-flex align-items-center justify-content-between">
                                        Total: <span>${totalAmountOrder}</span>
                                    </h5>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </Helmet>
    )
}

export default Checkout
