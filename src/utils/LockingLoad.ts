
export class LockingLoading{
    private loading: boolean = false
    private locks: number = 0

    setTrue(){
        this.loading = true
    }
    setFalse(){
        if(this.locks != 0) return
        this.loading = false
    }
    lock(){
        this.locks++
    }
    unLock(){
        this.locks--
    }
    isLoading(){
        return this.loading
    }
}