import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Grid, TextField } from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';

const ProductDetails = () => {
    const { id } = useParams();
    const productId = id;
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [error] = useState(null);

    useEffect(() => {
        axios
            .get(`http://localhost:8000/api/products/${productId}`)
            .then((response) => {
                console.log(response.data);
                setProduct(response.data);
            })
            .catch((error) => console.error('Error fetching product details:', error));
    }, [productId]);

    const handleIncreaseQuantity = () => {
        setQuantity((prevQuantity) => prevQuantity + 1);
    };

    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity((prevQuantity) => prevQuantity - 1);
        }
    };

    const handleBuyNow = () => {
        navigate(`/thankyou`);
    };

    return (
        <Container maxWidth="md">
            {product ? (
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <img src="/image-product-1-thumbnail.jpg" alt="Product" style={{ width: '100%' }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h5" gutterBottom>
                            {product.name}
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {product.description}
                        </Typography>
                        <Typography variant="h5" color="primary">
                            {typeof product.price === 'string' ? `RM ${parseFloat(product.price).toFixed(2)}` : 'Invalid Price'}
                        </Typography>
                        <div style={{ marginTop: '50px' }}>
                            Quantity:
                            <Button onClick={handleDecreaseQuantity} style={{ marginLeft: '10px' }}>
                                -
                            </Button>
                            <TextField
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                                sx={{ width: '70px', textAlign: 'center', appearance: 'none', '& input': { height: '5px' } }}
                                inputProps={{
                                    inputMode: 'numeric',
                                    pattern: '[0-9]*',
                                }}
                            />
                            <Button onClick={handleIncreaseQuantity}>+</Button>
                        </div>

                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
                        )}

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleBuyNow}
                            style={{ width: '100%', marginTop: '20px'}}
                        >
                            Buy Now
                        </Button>
                    </Grid>
                </Grid>
            ) : (
                <Typography variant="h6">Loading product details...</Typography>
            )}
        </Container>
    );
};

export default ProductDetails;