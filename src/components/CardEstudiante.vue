<template>
    <div class="card card-side bg-base-100 shadow-xl">
        <figure>
            <img :src="estudiante.fotoUrl" alt="Movie" />
        </figure>
        <div class="card-body">
            <h2 class="card-title"></h2>
            <p>{{estudiante.nombre}}</p>
        </div>
    </div>
</template>

<script>
export default {
    props: ["estudiante"],
    mounted(){
        console.log('mounted card estudiante', this.estudiante)
    }
}

</script>