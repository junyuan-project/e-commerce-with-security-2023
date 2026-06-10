import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, CardMedia, TextField, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
import '../App.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = async (event) => {
        const inputValue = event.target.value;

        try {
            const response = await axios.get(`http://localhost:8000/api/validate_search/?search=${encodeURIComponent(inputValue)}`);
            if (response.data.is_valid === false) {
                setAlertMessage('Invalid search query detected!');
                return;
            }
        } catch (error) {
            console.error('Error validating search query:', error);
            setAlertMessage('Error validating search query.');
            return;
        }

        const sanitizedQuery = DOMPurify.sanitize(inputValue);

        setSearchQuery(sanitizedQuery);
        setAlertMessage('');
    };

    useEffect(() => {
        const apiUrl = searchQuery
            ? `http://localhost:8000/api/products/?search=${encodeURIComponent(searchQuery)}`
            : 'http://localhost:8000/api/products/';

        axios.get(apiUrl)
            .then(response => {
                if (response.data.error) {
                    setAlertMessage(response.data.error);
                } else {
                    setProducts(response.data);
                }
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [searchQuery]);

    return (
        <div>
            <TextField
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                label="Search products"
                variant="outlined"
                fullWidth
                margin="normal"
                sx={{ width: '375px', marginBottom: '30px' }}
            />
            {alertMessage && (
                <Alert severity="error" className="alert">
                    {alertMessage}
                </Alert>
            )}
            <Grid container spacing={2}>
                {products.map(product => (
                    <Grid item key={product.id} xs={12} sm={6} md={4}>
                        <Link to={`/products/${product.id}`} className="card">
                            <Card>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image="image-product-1-thumbnail.jpg"
                                    alt="logo"
                                />
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {React.createElement('div', { dangerouslySetInnerHTML: { __html: product.name } })}
                                    </Typography>
                                    <Typography variant="body2" color="black">
                                        {React.createElement('div', { dangerouslySetInnerHTML: { __html: product.description } })}
                                    </Typography>
                                    <Typography variant="h6" color="primary">
                                        RM {product.price}
                                    </Typography>
                                </CardContent>
                                <div className="overlay">
                                    <Typography variant="h6" color="black">
                                        View Details
                                    </Typography>
                                </div>
                            </Card>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default ProductList;
