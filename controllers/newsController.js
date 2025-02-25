const { formidable } = require('formidable');
const cloudinary = require('cloudinary').v2;
const newsModel = require('../models/newsModel');
const galleryModel = require('../models/galleryModel');
const { mongo: { ObjectId } } = require('mongoose');
const moment = require('moment');

class newsController {
    constructor() {
        this.add_news = this.add_news.bind(this);
        this.get_all_news = this.get_all_news.bind(this);
        this.update_news = this.update_news.bind(this);
        this.update_news_update = this.update_news_update.bind(this);
        this.get_images = this.get_images.bind(this);
        this.add_images = this.add_images.bind(this);
        this.get_dashboard_news = this.get_dashboard_news.bind(this);
        this.get_dashboard_single_news = this.get_dashboard_single_news.bind(this);
        this.get_popular_news = this.get_popular_news.bind(this);
        this.get_latest_news = this.get_latest_news.bind(this);
        this.get_recent_news = this.get_recent_news.bind(this);
        this.get_news = this.get_news.bind(this);
        this.get_categories = this.get_categories.bind(this);
        this.get_category_news = this.get_category_news.bind(this);
        this.news_search = this.news_search.bind(this);
    }

    add_news = async (req, res) => {
        const form = formidable({});
        cloudinary.config({
            cloud_name: process.env.cloud_name,
            api_key: process.env.api_key,
            api_secret: process.env.api_secret,
            secure: true
        });

        try {
            const [fields, files] = await form.parse(req);
            const { title, description, category } = fields;

            if (!title || !description || !category || !files.image) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            const { url } = await cloudinary.uploader.upload(files.image[0].filepath, { folder: 'news_images' });

            const news = await newsModel.create({
                writerId: null,
                writerName: 'Anonymous',
                title: title[0].trim(),
                slug: title[0].trim().split(' ').join('-'),
                category: category[0],
                description: description[0],
                date: moment().format('LL'),
                image: url,
                status: 'active'
            });

            const allNews = await newsModel.find({ status: 'active' }).sort({ createdAt: -1 });
            return res.status(201).json({ message: 'News added successfully', news, allNews });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    get_all_news = async (req, res) => {
        try {
            const category_news = await newsModel.aggregate([
                { $sort: { createdAt: -1 } },
                { $match: { status: 'active' } },
                {
                    $group: {
                        _id: "$category",
                        news: {
                            $push: {
                                _id: '$_id',
                                title: '$title',
                                slug: '$slug',
                                writerName: '$writerName',
                                image: '$image',
                                description: '$description',
                                date: '$date',
                                category: '$category'
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        category: '$_id',
                        news: { $slice: ['$news', 5] }
                    }
                }
            ]);

            const news = {};
            category_news.forEach(item => {
                news[item.category] = item.news;
            });

            return res.status(200).json({ news });
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    update_news = async (req, res) => {
        const { news_id } = req.params;
        const { title, description, category } = req.body;

        try {
            const updatedNews = await newsModel.findByIdAndUpdate(
                news_id,
                { title, description, category },
                { new: true }
            );

            if (!updatedNews) {
                return res.status(404).json({ message: 'News not found' });
            }

            return res.status(200).json({ message: 'News updated successfully', updatedNews });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    update_news_update = async (req, res) => {
        const { news_id } = req.params;
        const { status } = req.body;

        try {
            const updatedNews = await newsModel.findByIdAndUpdate(
                news_id,
                { status },
                { new: true }
            );

            if (!updatedNews) {
                return res.status(404).json({ message: 'News not found' });
            }

            return res.status(200).json({ message: 'News status updated', updatedNews });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    // 🆕 New methods to fix missing routes

    get_popular_news = async (req, res) => {
        try {
            const popularNews = await newsModel.find({ status: 'active' }).sort({ views: -1 }).limit(5);
            return res.status(200).json({ news: popularNews });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    get_latest_news = async (req, res) => {
        try {
            const latestNews = await newsModel.find({ status: 'active' }).sort({ createdAt: -1 }).limit(5);
            return res.status(200).json({ news: latestNews });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    get_recent_news = async (req, res) => {
        try {
            const recentNews = await newsModel.find({ status: 'active' }).sort({ updatedAt: -1 }).limit(5);
            return res.status(200).json({ news: recentNews });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    get_news = async (req, res) => {
        const { slug } = req.params;
        try {
            const news = await newsModel.findOne({ slug, status: 'active' });
            if (!news) return res.status(404).json({ message: 'News not found' });
            return res.status(200).json({ news });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    get_categories = async (req, res) => {
        try {
            const categories = await newsModel.distinct('category');
            return res.status(200).json({ categories });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    get_category_news = async (req, res) => {
        const { category } = req.params;
        try {
            const news = await newsModel.find({ category, status: 'active' }).sort({ createdAt: -1 });
            return res.status(200).json({ news });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    news_search = async (req, res) => {
        const { query } = req.query;
        try {
            const news = await newsModel.find({
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } }
                ],
                status: 'active'
            });
            return res.status(200).json({ news });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };
}

module.exports = new newsController();
