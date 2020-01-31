import Router from 'koa-router';
import noteStore from './store';
import {broadcast} from "../utils/wsBroadcast";

export const router = new Router();

router.get('/', async (ctx) => {
    const response = ctx.response;
    response.body = await noteStore.find({user: ctx.state.user.username});
    response.status = 200; // ok
});

router.get('/:id', async (ctx) => {
    const note = await noteStore.findOne({_id: ctx.params.id});
    const response = ctx.response;
    if (note) {
        response.body = note;
        response.status = 200; // ok
    } else {
        response.status = 404; // not found
    }
});


router.post('/', async (ctx) => {
    const book = ctx.request.body;
	if(book.user === "user"){
		book.user = ctx.state.user.username
	}
    const response = ctx.response;

    try {
        console.log(book);
        const item = await noteStore.insert(book);
        response.body = item;
        response.status = 201; // created
        // broadcast({event: 'created', payload: item});
    } catch (err) {
        response.body = {issue: [{error: err.message}]};
        response.status = 400; // bad request
    }
});

router.put('/', async (ctx) => {
    const note = ctx.request.body;
		if(note.user === "user"){
		note.user = ctx.state.user.username
	}
    const noteId = note._id;
    const response = ctx.response;
    if (noteId) {
        const updatedCount = await noteStore.update({_id: noteId}, note);
        if (updatedCount === 1) {
            const newItems = await noteStore.find({_id: noteId});
            const item = newItems[0];
            response.body = item;
            response.status = 200; // ok
            // broadcast({event: 'updated', payload: item});
        } else {
            response.body = {issue: [{error: 'Resource no longer exists'}]};
            response.status = 405; // method not allowed
        }
    }
    if (!noteId) {
        response.body = {issue: [{error: 'Body id is not defined'}]};
        response.status = 400; // bad request
    }
});

router.del('/:id', async (ctx) => {
    const rez = await noteStore.remove({_id: ctx.params.id});
    if (rez == 1) {
        ctx.response.status = 200; // success
        ctx.response.body = true;
        // broadcast({event: 'deleted', payload: payload});
    } else {
        ctx.response.status = 400; // bad request
        ctx.response.body = false
    }

});
