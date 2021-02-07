const Category = require("../Model/Category");
const Bank = require("../Model/Bank");
const Feature = require("../Model/Feature");
const Activity = require("../Model/Activity");
const Users = require("../Model/Users");
const Item = require("../Model/Item");
const Image = require("../Model/Image");
const Booking = require("../Model/Booking");
const Member = require("../Model/Member");
const fs = require("fs-extra");
const path = require("path");
const bcrypt = require("bcryptjs");
module.exports = {
  viewSignin: async (req, res) => {
    try {
      const alertMassage = req.flash("alertMassage");
      const alertStatus = req.flash("alertStatus");
      const alert = { massage: alertMassage, status: alertStatus };
      res.render("index", {
        alert,
        title: "Login",
      });
    } catch (error) {
      res.redirect("Admin/Singin");
    }
  },
  actionSignin: async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log(req);
      const user = await Users.findOne({ username: username });
      console.log(user);
      if (!user) {
        req.flash("alertMassage", `user yang anda masukan tidak ada`);
        req.flash("alertStatus", "danger");
        res.redirect("/admin/signin");
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      console.log(isPasswordMatch);
      if (!isPasswordMatch) {
        req.flash("alertMassage", `password tidak cocok`);
        req.flash("alertStatus", "danger");
        res.redirect("/admin/signin");
      }
      res.redirect("/admin/dashboard");

      req.session.user = {
        id: user.id,
        username: user.username,
      };
      console.log("isi session=>", req.session.user);
    } catch (error) {
      res.redirect("/admin/signin");
    }
  },
  actionLogout: (req, res) => {
    req.session.destroy();
    res.redirect("/admin/signin");
  },
  viewDashboard: async (req, res) => {
    try {
      const member = await Member.find();
      const booking = await Booking.find();
      const item = await Item.find();
      res.render("Admin/Dashboard/view_dashboard", {
        title: "staycation |Dashboard",
        member,
        booking,
        item,
        user: req.session.user,
      });
    } catch (error) {}
  },
  viewCategory: async (req, res) => {
    try {
      const category = await Category.find();
      const alertMassage = req.flash("alertMassage");
      const alertStatus = req.flash("alertStatus");
      const alert = { massage: alertMassage, status: alertStatus };
      res.render("Admin/Category/view_category", {
        category,
        alert,
        title: "staycation | Category",
      });
    } catch (error) {
      res.redirect("Admin/Category");
    }
  },
  addCategory: async (req, res) => {
    try {
      console.log(req.body);
      const { name } = req.body;
      console.log(name);
      await Category.create({ name });
      req.flash("alertMassage", "success add Category");
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMassage", `${error.massage}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },
  editCategory: async (req, res) => {
    try {
      const { id, name } = req.body;
      const category = await Category.findOne({ _id: id });
      category.name = name;
      await category.save();
      req.flash("alertMassage", "success Update Category");
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMassage", `${error.massage}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findOne({ _id: id });
      console.log(id);
      await category.remove();
      req.flash("alertMassage", "success Delete Category");
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMassage", `${error.massage}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },
  viewBank: async (req, res) => {
    try {
      const bank = await Bank.find();
      const alertMassage = req.flash("alertMassage");
      const alertStatus = req.flash("alertStatus");
      const alert = { massage: alertMassage, status: alertStatus };
      res.render("Admin/Bank/view_bank", {
        alert,
        title: "staycation |Bank",
        bank,
      });
    } catch (error) {
      req.flash("alertMassage", `${error.massage}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },
  editBank: async (req, res) => {
    try {
      const { id, Name, nameBank, nomorRekening } = req.body;
      console.log(id + Name + nameBank);
      const bank = await Bank.findOne({ _id: id });
      console.log(bank);
      if (req.file == undefined) {
        bank.Name = Name;
        bank.nameBank = nameBank;
        bank.nomorRekening = nomorRekening;
        await bank.save();
        req.flash("alertMassage", "success Edit Category");
        req.flash("alertStatus", "success");

        res.redirect("/admin/bank");
      } else {
        await fs.unlink(path.join(`public/${bank.ImageUrl}`));
        bank.Name = Name;
        bank.nameBank = nameBank;
        bank.nomorRekening = nomorRekening;
        bank.ImageUrl = `images/${req.file.filename}`;
        await bank.save();
        res.redirect("/admin/bank");
      }
    } catch (error) {
      console.log(error);
      req.flash("alertMassage", "success Delete Category");
      req.flash("alertStatus", "success");
      req.flash("alertStatus", "success");
      console.log(error);
    }
  },
  addBank: async (req, res) => {
    try {
      const { Name, nameBank, nomorRekening } = req.body;

      await Bank.create({
        nameBank,
        Name,
        nomorRekening,
        ImageUrl: `images/${req.file.filename}`,
      });
      req.flash("alertMassage", "success add Bank");
      req.flash("alertStatus", "success");
      res.redirect("/admin/bank");
    } catch (error) {
      req.flash("alertMassage", `${error.massage}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },
  deleteBank: async (req, res) => {
    try {
      const { id } = req.params;

      const bank = await Bank.findOne({ _id: id });
      await fs.unlink(path.join(`public/${bank.ImageUrl}`));
      await bank.remove();
      req.flash("alertMassage", "success delete Bank");
      req.flash("alertStatus", "success");
      res.redirect("/admin/bank");
    } catch (error) {
      console.log(error);
      req.flash("alertMassage", `${error.massage}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },
  viewItem: async (req, res) => {
    try {
      const item = await Item.find()
        .populate({ path: "imageId", select: "id imageUrl" })
        .populate({ path: "categoryId", select: "id name" });
      const alertMassage = req.flash("alertMassage");
      const alertStatus = req.flash("alertStatus");
      const alert = { massage: alertMassage, status: alertStatus };
      const category = await Category.find();

      res.render("Admin/Item/view_item", {
        title: "staycation |Item",
        category,
        item,
        alert,
        action: "view",
      });
      res.redirect("/admin/item");
    } catch (error) {
      console.log(error);
      req.flash("alertMassage", `${error.massage}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },
  addItem: async (req, res) => {
    try {
      const { title, price, city, categoryId, about } = req.body;

      if (req.files.length > 0) {
        const category = await Category.findOne({ _id: categoryId });
        const newItem = {
          categoryId: category._id,
          title,
          description: about,
          price,
          city,
        };
        const item = await Item.create(newItem);
        category.itemId.push({ _id: item._id });
        await category.save();
        for (let index = 0; index < req.files.length; index++) {
          const imageSave = await Image.create({
            imageUrl: `images/${req.files[index].filename}`,
          });
          item.imageId.push({ _id: imageSave._id });
          await item.save();
        }
        req.flash("alertMassage", "success add Item");
        req.flash("alertStatus", "success");
        res.redirect("/admin/item");
      }
    } catch (error) {
      console.log(error);
      req.flash("alertMassage", `${error.massage}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },
  showImageItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id }).populate({
        path: "imageId",
        select: "id imageUrl",
      });

      const category = await Category.find();

      res.render("Admin/Item/view_item", {
        title: "staycation | show image Item",
        category,
        item,
        action: "show image",
      });
    } catch (error) {
      console.log(error);
    }
  },
  showEditItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id })
        .populate({ path: "imageId", select: "id imageUrl" })
        .populate({ path: "categoryId", select: "id name" });

      const category = await Category.find();

      res.render("Admin/Item/view_item", {
        title: "staycation | show edit Item",
        category,
        item,
        action: "edit",
      });
    } catch (error) {
      console.log(error);
    }
  },
  editItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id })
        .populate({ path: "imageId", select: "id imageUrl" })
        .populate({ path: "categoryId", select: "id name" });
      const { title, price, city, categoryId, about } = req.body;

      //kalo file ada
      if (req.files.length > 0) {
        //looping dari db imageId
        for (let i = 0; i < item.imageId.length; i++) {
          //select semua image seperti item image id
          const imageUpdate = await Image.findOne({ _id: item.imageId[i].id });
          //hapus file image
          await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`));
          //ganti url
          imageUpdate.ImageUrl = `images/${req.files[i].filename}`;
          //update
          await imageUpdate.save();
          item.title = title;
          item.price = price;
          item.city = city;
          item.description = about;
          item.categoryId = categoryId;
          await item.save();
          req.flash("alertMassage", "success edit Item");
          req.flash("alertStatus", "success");
          res.redirect("/admin/item");
        }
      }
      //kalo file gaada
      else {
        //item di database di ganti menjadi data dari req body
        item.title = title;
        item.price = price;
        item.city = city;
        item.description = about;
        item.categoryId = categoryId;
        await item.save();
        req.flash("alertMassage", "success edit Item");
        req.flash("alertStatus", "success");
        res.redirect("/admin/item");
      }
    } catch (error) {
      console.log(error);
      req.flash("alertMassage", `${error.massage}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },
  deleteItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id }).populate("imageId");

      for (let i = 0; i < item.imageId.length; i++) {
        Image.findOne({ _id: item.imageId[i]._id })
          .then((image) => {
            fs.unlink(path.join(`public/${image.ImageUrl}`));
            image.remove();
          })
          .catch((error) => {
            req.flash("alertMassage", `${error.massage}`);
            req.flash("alertStatus", "danger");
            res.redirect("/admin/item");
          });
      }
      await item.remove();
      req.flash("alertMassage", "success delete Item");
      req.flash("alertStatus", "success");
      res.redirect("/admin/item");
    } catch (error) {
      req.flash("alertMassage", `${error.massage}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },
  viewDetailItem: async (req, res) => {
    const { itemId } = req.params;
    const alertMassage = req.flash("alertMassage");
    const alertStatus = req.flash("alertStatus");
    const alert = { massage: alertMassage, status: alertStatus };
    const feature = await Feature.find({ itemId: itemId });
    const activity = await Activity.find({ itemId: itemId });

    res.render("Admin/Item/view_details_item/view_details_item", {
      title: "staycation | Details",
      itemId,
      alert,
      feature,
      activity,
    });

    try {
    } catch (error) {
      console.log(error);
      req.flash("alertMassage", `${error.massage}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/${itemId}`);
    }
  },
  addFeature: async (req, res) => {
    const { name, qty, itemId } = req.body;

    try {
      if (!req.file) {
        req.flash("alertMassage", "image not found");
        req.flash("alertStatus", "danger");
        res.redirect("/admin/item");
      }
      const feature = {
        name: name,
        qty: qty,
        itemId: itemId,
        imageUrl: `images/${req.file.filename}`,
      };
      const id = await Feature.create(feature);
      console.log(id);
      const item = await Item.findOne({ _id: itemId });
      item.featureId.push({ _id: id._id });
      await item.save();
      req.flash("alertMessage", "Success Add Feature");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      console.log(error);
    }
  },
  editFeature: async (req, res) => {
    try {
      const { id, name, qty, itemId } = req.body;

      const feature = await Feature.findOne({ _id: id });

      if (req.file == undefined) {
        feature.name = name;
        feature.qty = qty;
        await feature.save();
        req.flash("alertMassage", "success Edit Feature");
        req.flash("alertStatus", "success");
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      } else {
        await fs.unlink(path.join(`public/${feature.ImageUrl}`));
        feature.name = name;
        feature.qty = qty;
        feature.imageUrl = `images/${req.file.filename}`;
        await feature.save();
      }
    } catch (error) {
      console.log(error);
      req.flash("alertMassage", "success Delete Category");
      req.flash("alertStatus", "success");
      req.flash("alertStatus", "success");
      console.log(error);
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },
  deleteFeature: async (req, res) => {
    const { id, itemId } = req.params;
    try {
      const feature = await Feature.findOne({ _id: id });

      const item = await Item.findOne({ _id: itemId }).populate("featureId");
      for (let i = 0; i < item.featureId.length; i++) {
        if (item.featureId[i]._id.toString() === feature._id.toString()) {
          item.featureId.pull({ _id: feature._id });
          await item.save();
        }
      }
      await fs.unlink(path.join(`public/${feature.imageUrl}`));
      await feature.remove();
      req.flash("alertMessage", "Success Delete Feature");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },
  addActivity: async (req, res) => {
    const { name, type, itemId } = req.body;
    try {
      if (!req.file) {
        req.flash("alertMassage", "image not found");
        req.flash("alertStatus", "danger");
        res.redirect("/admin/item");
      }

      const activity = await Activity.create({
        name: name,
        type: type,
        itemId: itemId,
        imageUrl: `images/${req.file.filename}`,
      });

      const item = await Item.findOne({ _id: itemId });

      item.activityId.push({ _id: activity._id });
      await item.save();
      req.flash("alertMessage", "Success Add Feature");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      console.log(error);
    }
  },
  editActivity: async (req, res) => {
    try {
      const { id, name, type, itemId } = req.body;

      const activity = await Activity.findOne({ _id: id });

      if (req.file == undefined) {
        activity.name = name;
        activity.type = type;
        await activity.save();
        req.flash("alertMassage", "success Edit activity");
        req.flash("alertStatus", "success");
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      } else {
        await fs.unlink(path.join(`public/${activity.ImageUrl}`));
        activity.name = name;
        activity.type = type;
        activity.imageUrl = `images/${req.file.filename}`;
        await activity.save();
      }
    } catch (error) {
      console.log(error);
      req.flash("alertMassage", "failed Delete Category");
      req.flash("alertStatus", "danger");

      console.log(error);
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },
  deleteActivity: async (req, res) => {
    const { id, itemId } = req.params;
    try {
      const activity = await Activity.findOne({ _id: id });
      const item = await Item.findOne({ _id: itemId }).populate("activityId");
      for (let i = 0; i < item.activityId.length; i++) {
        if (item.activityId[i]._id.toString() === activity._id.toString()) {
          item.activityId.pull({ _id: activity._id });
          await item.save();
        }
      }
      await fs.unlink(path.join(`public/${activity.imageUrl}`));
      await activity.remove();
      req.flash("alertMessage", "Success Delete activity");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },
  viewBooking: async (req, res) => {
    try {
      const booking = await Booking.find()
        .populate("memberId")
        .populate("bankId");
      console.log(booking);
      res.render("Admin/Booking/view_booking", {
        title: "staycation |Booking",
        booking,
        user: req.session.user,
      });
    } catch (error) {
      res.redirect(`/admin/booking`);
    }
  },
  showDetailBooking: async (req, res) => {
    const { id } = req.params;
    try {
      const alertMassage = req.flash("alertMassage");
      const alertStatus = req.flash("alertStatus");
      const alert = { massage: alertMassage, status: alertStatus };
      const booking = await Booking.findOne({ _id: id })
        .populate("memberId")
        .populate("bankId");

      res.render("Admin/Booking/show_detail_booking", {
        title: "staycation |Booking",
        booking,
        user: req.session.user,
        alert,
      });
    } catch (error) {
      res.redirect(`/admin/booking`);
    }
  },
  actionConfirm: async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await Booking.findOne({ _id: id });

      booking.payments.status = "accept";
      await booking.save();
      req.flash("alertMessage", "Success confirmation payments");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/booking/${id}`);
    } catch (error) {
      console.log(error);
      res.redirect(`/admin/booking/${id}`);
    }
  },
  actionReject: async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await Booking.findOne({ _id: id });
      booking.payments.status = "Reject";
      await booking.save();
      req.flash("alertMessage", "Success Reject payments");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/booking/${id}`);
    } catch (error) {
      res.redirect(`/admin/booking/${id}`);
    }
  },
};
